function addFilter()
{
	var body = $('#filter').children('TBODY');
	var row = $('#filter tr:first td:eq(1)').clone().appendTo($('<tr></tr>').appendTo(body));

	var count = parseInt($('#filter td:first').attr('rowspan'), 10) + 1;
	$('#filter td:first').attr('rowspan', count)

	if (count > 1) {
		$('#filter .filter-del').removeAttr('disabled');
	} else {
		$('#filter .filter-del').attr('disabled', 1);
	}

	row.find('.filter-add').click(filterAddClick);
	row.find('.filter-del').click(filterDelClick);
	row.find('.filter-by').change(filterByChange);
	row.find('.filter-text').change(function(){ filterChange(true); });
	row.find('.filter-status').change(function(){ filterChange(true); });

	return row;
}

function filterAddClick()
{
	addFilter().find('.filter-by').change();
}

function filterDelClick()
{
	var header = $('#filter td:first');
	var row = $(this).parent().parent();

	if (!row.index()) {
		header.prependTo(row.next());
	}
	row.remove();

	var count = parseInt(header.attr('rowspan'), 10) - 1;
	header.attr('rowspan', count);

	if (count > 1) {
		$('#filter .filter-del').removeAttr('disabled');
	} else {
		$('#filter .filter-del').attr('disabled', 1);
	}

	filterChange(true);
}

function Filter(type, unparsed, value, column)
{
    this.type = type;
    this.unparsed = unparsed;
    this.value = value;
	this.column = column;
    this.handler = function(row) {
		switch(this.type) {
		case 'status':
			return row.children[this.column].innerHTML == this.value;
		case 'priority':
			switch (this.unparsed[0]) {
			case '>':
				return parseInt(row.children[this.column].innerHTML, 10) > this.value;
			case '<':
				return parseInt(row.children[this.column].innerHTML, 10) < this.value;
			case '=':
			default:
				return parseInt(row.children[this.column].innerHTML, 10) == this.value;
			}
		case 'title':
		case 'author':
		case 'editor':
			switch (this.unparsed[0]) {
			case '>':
				return row.children[this.column].innerHTML.toLowerCase().indexOf(this.value) >= 0;
			case '^':
				return row.children[this.column].innerHTML.toLowerCase().indexOf(this.value) == 0;
			case '$':
				var testValue = row.children[this.column].innerHTML.toLowerCase();
				return testValue.indexOf(this.value) == (testValue.length - this.value.length);
			case '=':
			default:
				return row.children[this.column].innerHTML.toLowerCase() == this.value;
			}
		}
    };
}

function filterChange(save)
{
	var filters = [];
	$('#filter tr').each(function() {
		var by = $(this).find('td:last-child .filter-by option:selected');
		var status = $(this).find('td:last-child .filter-status option:selected');
		var text = $(this).find('td:last-child .filter-text');
		var error = $(this).find('td:last-child .filter-error');
		var id = by.index() - 1/*---*/;

		error.html('');
		var obj = null;

		switch(by.text()) {
		case 'status':
			var value = status.text();
			if (value != '---') {
				obj = new Filter(by.text(), null, value, id);
			}
			break;
		case 'priority':
			var value = text.val();

			switch (value[0]) {
			case '>':
			case '<':
			case '=':
				value = value.substring(1);
			}

			value = parseInt(value, 10);
			if (!isNaN(value)) {
				obj = new Filter(by.text(), text.val(), value, id);
			}
			break;
		case 'title':
		case 'author':
		case 'editor':
			var value = text.val();

			switch (value[0]) {
			case '>':
			case '^':
			case '$':
			case '=':
			case '\\':
				value = value.substring(1);
			}

			if (value) {
				obj = new Filter(by.text(), text.val(), value.toLowerCase(), id);
			}
			break;
		case 'edited':
		case 'created':
			var date = text.val();

			switch (date[0]) {
			case '>':
			case '<':
			case '=':
				date = date.substring(1);
			}

			if (date) {
				var value = new Date(date)
				if (!isNaN(value)) {
					if (date != value.toISOString()) {
						error.html('ISO fix: ' + value.toISOString());
					}
					obj = new Filter(by.text(), text.val(), value, id);
				} else {
					error.html('error: invalid date!');
				}
			}
		}

		if (obj) {
			filters.push(obj);
		}
	});

	if (save && (typeof(Storage) !== 'undefined')) {
		localStorage.setItem('filters', JSON.stringify(filters));
	}

	$('#tickets tbody tr').each(function() {
		var row = this;
		if (filters.find(function(item, index, array) { return item.handler(row) == false; }) === undefined) {
			$(row).removeAttr('hidden');
		} else {
			$(row).attr('hidden', 1);
		}
	});
}

function filterByChange()
{
	var option = $(this).find('option:selected');
	var status = $(this).parent().find('.filter-status');
	var text = $(this).parent().find('.filter-text');

	switch (option.text()) {
	case 'status':
		status.removeAttr('hidden');
		text.attr('hidden', 1);
		break;
	case '---':
		text.attr('hidden', 1);
		status.attr('hidden', 1);
		break;
	default:
		text.removeAttr('hidden');
		status.attr('hidden', 1);
		break;
	}

	switch (option.text()) {
	case 'priority':
		text.attr('placeholder', '>2; <5; =3');
		break;
	case 'title':
		text.attr('placeholder', '>some text...');
		break;
	case 'author':
	case 'editor':
		text.attr('placeholder', '>John; =Kris');
		break;
	case 'edited':
	case 'created':
		text.attr('placeholder', '>2000-01-25T09:30:00Z');
		break;
	case '---':
		text.removeAttr('placeholder');
		break;
	}

	text.val('');
	status.val('---');

	filterChange(true);
}

$(document).ready(function() {
	$('#filter .filter-add').click(filterAddClick);
	$('#filter .filter-del').click(filterDelClick);
	$('#filter .filter-by').change(filterByChange);
	$('#filter .filter-text').change(function(){ filterChange(true); });
	$('#filter .filter-status').change(function(){ filterChange(true); });

	var filters = null;
	if (typeof(Storage) !== 'undefined') {
		filters = JSON.parse(localStorage.getItem('filters'));
	}

	if (filters) {
		filters.forEach(function(item, index, array) {
			var row = index ? addFilter() : $('#filter tr:first td:nth-child(2)');
			var by = row.find('.filter-by');
			var status = row.find('.filter-status');
			var text = row.find('.filter-text');

			by.val(item.type);

			switch (item.type) {
			case 'status':
				status.val(item.value);
				status.removeAttr('hidden');
				text.attr('hidden', 1);
				break;
			default:
				text.val(item.unparsed);
				text.removeAttr('hidden');
				status.attr('hidden', 1);
				break;
			}
		});

		filterChange(false);
	}
});
