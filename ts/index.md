---
title: Ticket System
---

## %(title)s

Changed by **%(input-commiter)s** at %(input-date-commit)s

%(body:filter.md)s

<table id="tickets">
<thead>
<tr>
	<th class="sortTable">Status</th>
	<th class="sortTable">Priority</th>
	<th class="sortTable">Title</th>
	<th class="sortTable">Author</th>
	<th class="sortTable">Editor</th>
	<th class="sortTable">Edited</th>
	<th class="sortTable">Created</th>
</tr>
</thead>
%(glob:row:t-*.md)s
</table>
