function sortTable(table, colId, reverse) {
	var body = $(table).children('TBODY');
	body.children().sort(function(a, b){
		var x = a.children[colId];
		var y = b.children[colId];

		if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
			return reverse ? +1 : -1;
		}

		if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			return reverse ? -1 : +1;
		}

		return  0;
	}).appendTo(body);
}

$(document).ready(function() {
	$('.sortTable').click(function() {
		var desc = $(this).hasClass('desc');
		var sorted = $(this).hasClass('sorted');

		$(this).siblings().removeClass('sorted');
		$(this).siblings().removeClass('desc');

		if (sorted || desc) {
			$(this).toggleClass('desc');
			$(this).toggleClass('sorted');
		} else {
			$(this).addClass('sorted');
		}

		sortTable($(this).closest('TABLE')[0], $(this).index(), $(this).hasClass('desc'));

		if (typeof(Storage) !== 'undefined') {
			localStorage.setItem('sortTable', JSON.stringify({column: $(this).index(), desc: (sorted || desc)}));
		}

	});

	// prevent to select text in headers
	$('.sortTable').attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);

	// session load
	var sess = null;
	if (typeof(Storage) !== 'undefined') {
		sess = JSON.parse(localStorage.getItem('sortTable'));
	}

	// first select
	if (sess) {
		var th = $('table .sortTable')[sess.column];
		if (sess.desc) {
			$(th).addClass('sorted');
		}
		$(th).click();
	} else {
		$('table .sortTable:first-child').click();
	}
});
