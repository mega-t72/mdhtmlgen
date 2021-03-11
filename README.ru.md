HTML генератор на базе языка разметки markdown.
Для генерации требуется: HTML-шаблон и markdown-шаблон.
Дополнительные meta-расширения позволяют добавить метапрограммирование в этот процесс.

Читать на других языках: [English](README.md), [Russian](README.ru.md)

## Установка

```console
pip install mdhtmlgen
```

## Использование

```console
$ python -m mdhtmlgen --help
Usage: python -m mdhtmlgen [options]

Options:
  -h, --help            show this help message and exit
  -S SOURCE, --source=SOURCE
                        Markdown source filename (*.md)
  -H HTML, --html=HTML  HTML template filename (*.t)
  -t, --trace           Print diagnostic traces
  -o OUTPUT, --output=OUTPUT
                        Set output file
  -m MARKDOWN_EXT, --markdown-ext=MARKDOWN_EXT
                        Set markdown extension list, coma separated, e.g.
                        meta,toc,footnotes
  -d DATE_FMT, --date-fmt=DATE_FMT
                        Set date format, e.g. %d-%m-%Y %H:%M:%S
  -e EXT, --ext=EXT     Set extension list, e.g. meta,glob,filename,date
  -a PARAMS, --add=PARAMS
                        Add parameter in format name:value
  -g GIT_DIR, --git-dir=GIT_DIR
                        Set GIT directory location, e.g. /home/user/repo/.git
```

## Инструменты

В качестве шаблонизатора html и markdown мы используем python, и его гениальную фичу - форматирование строки с помощью словаря.
Простой пример:

```python
print('Dear %(name)s, I am interested in the %(post)s position at your company…' % {'name': 'Oliver', 'post': 'Sales Manager'})
```

Здесь `name` и `post` - параметры шаблона. Если выпонимаете как работает этот пример, значит и с остальным проблем не будет.

Сам по себе markdown не генерирует готовый html.
Markdown отвечает за контент, поэтому для генерации html мы используем дополнительный шаблон страницы.

## Пример

Давайте создадим шаблон простой страницы - `html.t`:
```html
<!DOCTYPE html>
<html>
	<head>
		<title>%(title)s</title>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="styles.css" />
	</head>
	<body>%(body)s</body>
</html>
```

А теперь добавим шаблон контента для этой страницы - `example.md`:

```markdown
---
title: Example Page
---

## Task scenario

You want to buy traveler’s checks with your credit card. Which percentage rate applies to the purchase?

*Possible answers:*

* The Standard APR of 10.99%
* The Cash Advance APR of 24.24%[^*]
* The Penalty APR of 29.99%
* I don’t know

[^*]: This is the correct answer, based on my own credit card company’s cardmember agreement.
```

Последний шаг - совместим 2 шаблона в 1 html:

```console
$ python -m mdhtmlgen -S example.md -H html.t -o example.html
```

То же самое можно сделать через редирект:

```console
$ python -m mdhtmlgen -S example.md -H html.t >example.html
```

Кому как удобнее - результат будет тот же.

В шаблоне HTML я добавил `styles.css`. Для нашего примера можно взять готовые стили, [к примеру из проекта sindresorhus/github-markdown-css](https://sindresorhus.com/github-markdown-css/github-markdown.css), они покрывают функционал `markdown`.
Но если вам будет мало - вы всегда можете расширить `html.t`, добавить ссылки на дополнительные стили и скрипты.

## Extensions

Без расширений `markdown` очень ограничен. Список базовых расширений можно найти [на странице markdown в github](https://python-markdown.github.io/extensions/).
В `mdhtmlgen` можно передать список расширений, которые необходимо задействовать при генерации, при помощи опции `-m` или `--markdown-ext`.

Помимо `markdown` расширений, `mdhtmlgen` обладает своими мета-расширениями. На данный момент их 6:

* `filename`<br />
Добавляет в шаблон информацию о пути исходного файла шаблона `markdown`:<br />
  * `%(input-path)s` - полный путь шаблона
  * `%(input-name)s` - имя файла шаблона
  * `%(input-ext)s` - расширение имении файла шаблона
  * `%(input-basename)s` - базовое имя файла шаблона<br />
и аналогичную информацию о конечном файле html:<br />
  * `%(output-path)s`
  * `%(output-name)s`
  * `%(output-ext)s`
  * `%(output-basename)s`
* `date`<br />
Добавляет в шаблон информацию о дате и времени последнего изменения исходного файла шаблона `markdown` - `%(input-date)s`
* `gitdate`<br />
Добавляет в шаблон информацию о дате и времени последнего изменения исходного файла шаблона `markdown` в репозитории Git - `%(input-git-date)s`.<br />
Для этого расширения необходимо указать путь до репозитория через опцию `--git-dir` (аналогичная опция существует в Git, см. `man git`).
* `custom`<br />
Позволяет добавлять в шаблон произвольные мета-параметры через опцию `-a` или `--add`
* `meta`<br />
Импортирует в шаблон мета-параметр из другого шаблона, пример: `%(input-file-date:other-example.md)s`.<br />
Так мы извлекли `%(input-file-date)s` из файла `other-example.md`
* `glob`<br />
Склеивает мета-параметры из разных шаблонов, пример: `%(glob:row:*.md)s`.<br />
Так мы склеили `%(row)s` из всех файлов по шаблону поиска `*.md`.
