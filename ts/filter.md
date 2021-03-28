---
title: unused
status-open: Open
status-close: Close
---

<table id="filter">
	<tr>
		<td rowspan="1">
			Filter by:
		</td>
		<td>
			 <select class="filter-by">
				<option>---</option>
				<option>status</option>
				<option>priority</option>
				<option>title</option>
				<option>author</option>
				<option>editor</option>
				<option>edited</option>
				<option>created</option>
			</select>
			<input class="filter-text" type="text" value="" hidden="1" />
			<select class="filter-status" hidden="1">
				<option>---</option>
				<option>%(status-open)s</option>
				<option>%(status-close)s</option>
			</select>
			<input class="filter-add" type="button" value="+" />
			<input class="filter-del" type="button" value="--" disabled="1" />
			<span class="filter-error" />
		</td>
	</tr>
</table>
