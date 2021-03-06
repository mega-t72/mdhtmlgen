Markdown based html generator.

Generation requires: HTML template and markdown template.<br />
The generator has additional meta extensions that allow you to do metaprogramming in HTML.

Read this in other languages: [English](README.md), [Russian](README.ru.md)

## Installation

```console
pip install mdhtmlgen
```

## Usage

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

## Tools

We use `python` as the template engine for html and markdown, and its ingenious feature is *string formatting using a dictionary*.
A simple example:

```python
print('Dear %(name)s, I am interested in the %(post)s position at your company…' % {'name': 'Oliver', 'post': 'Sales Manager'})
```

Here `name` and `post` are template parameters. If you understand how this example works, then there will be no problems with the rest.

Markdown itself does not generate html.
Markdown is responsible for the content, so we use an additional page template to generate the html.

## Example

Let's create a simple page template - `html.t`:
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

Now let's add a content template for this page - `example.md`:

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

The last step is to combine 2 templates into 1 html:

```console
$ python -m mdhtmlgen -S example.md -H html.t -o example.html
```

The same can be done via a redirect:

```console
$ python -m mdhtmlgen -S example.md -H html.t >example.html
```

Whichever is more convenient - the result will be the same.

As you can see, In HTML template was added `styles.css`. For our example, we can take ready styles, [for example from the sindresorhus/github-markdown-css project](https://sindresorhus.com/github-markdown-css/github-markdown.css), they cover the `markdown` functionality.
But if it is not enough for you, you can always extend `html.t`, add links to additional styles and scripts.

## Extensions

Without extensions, `markdown` is very limited. A list of basic extensions can be found [on the markdown github page](https://python-markdown.github.io/extensions/).
Into `mdhtmlgen`, you can pass a list of extensions to be used during generation using the` -m` or `--markdown-ext` option.

Besides the `markdown` extensions,` mdhtmlgen` has its own meta extensions. At the moment there are 6 of them:

### filename

Adds path information to the template for the source:

* `%(input-path)s` - full source path
* `%(input-name)s` - name of source file
* `%(input-ext)s` - extension of source filename
* `%(input-basename)s` - basename of source

and similar information about the output:

* `%(output-path)s`
* `%(output-name)s`
* `%(output-ext)s`
* `%(output-basename)s`

### stat

Adds information about the file statistics of the source to the template:

* `%(input-date-update)s` - date and time when the file was last modified
* `%(input-date-create)s` - file creation date and time (if supported by FS)
* `%(input-owner)s` - file owner name

### git

Adds information about the statistics of a file in the Git repository to the template:

* `%(input-date-commit)s` - date and time when the file was last modified
* `%(input-commiter)s` - name of the last editor of the file
* `%(input-date-add)s` - date and time when the file was added to the repository
* `%(input-author)s` - the name of the first editor of the file

For this extension, you need to specify the path to the repository using the `--git-dir` option (a similar option exists in Git, see `man git`).

### custom

Allows you to add arbitrary meta-parameters to the template using the option `-a` or` --add`

### meta

Imports a meta-parameter from another source into a template, example: `%(input-file-date:other-example.md)s`.<br />
Here we have extracted `%(input-file-date)s` from the `other-example.md` source

### glob

Concatenates meta parameters from different sources, example: `%(glob:row:*.md)s`.<br />
Here we have concatenated `%(row)s` from all sources using the search pattern `*.md`.

Native `mdhtmlgen` extensions can be enabled with the` -e` or `--ext` options.