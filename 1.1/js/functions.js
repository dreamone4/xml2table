"use strict";

var XML2Table 		= XML2Table || {};
	XML2Table.views = XML2Table.views || {};

var xmlDoc, $xml, nm, $rootElement;

// Initialize
XML2Table.init = function () {

	xmlDoc 			 	= $.parseXML($('#xmlcode').val());  // XML to DOM object
    $xml    			= $(xmlDoc);                        // DOM to JQuery object
	
	$rootElement	 	= $xml.children().first(); 			// Gets the XML root element
	nm 					= new XML2Table.NodeManager();

	nm.analyzeNodes($rootElement);

	XML2Table.views.buildSelectCollection(nm, '#selectCollectionNode');

}

XML2Table.views.buildSelectCollection = function(nodeManager, jquerySelector) {

	//$(jquerySelector).html('<option value=""></option>');	// Reset
	$(jquerySelector).html('');	// Reset

	$.each(nodeManager.getCollectionNodes(), function(index, val) {
		$(jquerySelector).append('<option value="' + val + '">' + val + '</option>');
	});

	var firstSelectItem = $(jquerySelector + ' option:selected').val();

	if (firstSelectItem != '' && firstSelectItem != undefined) {
		XML2Table.views.buildSelectEndNodes(nm, firstSelectItem, '#renderValuesToDisplay');
	}
	$('#dynamicTableDiv>p').html('');
	
};

XML2Table.views.buildSelectEndNodes = function(nodeManager, collectionNode, jquerySelector) {

	$(jquerySelector).html('');	// Reset

	$.each(nodeManager.getEndNodes(collectionNode), function(index, val) {
		$(jquerySelector).append('<input type="checkbox" name="selectedValues" class="endNodeCheckbox" value="'+val+'">'+val+'<br>');
	});

	$('.endNodeCheckbox').click(function() {
		XML2Table.views.renderTable(nodeManager);
	});
	
};

XML2Table.views.renderTable = function(nodeManager) {

	var collectionNode 		= $('#selectCollectionNode option:selected').val();
	var selectedEndNodes 	= new Array();

	$('.endNodeCheckbox').each(function(i,v) {

		 if($(this).is(':checked')) {

		 	selectedEndNodes.push($(this).val());

		 }

	});

	$('#dynamicTableDiv>p').html(nm.getTable($rootElement, collectionNode, selectedEndNodes));

	styleTable();

};


/*	Events */
$(function() {

	// XML Textarea
	$('#xmlcode').keyup(function() {
		$('#renderValuesToDisplay').html('');
		XML2Table.init();
		$('#dynamicTableDiv>p').html('');
	});

	// Selectbox collection node
	$('#selectCollectionNode').change(function(e) {
		if (e.target.value != '' && e.target.value != undefined) {
			XML2Table.views.buildSelectEndNodes(nm, e.target.value, '#renderValuesToDisplay');
		}
		$('#dynamicTableDiv>p').html('');
	});

	// Select all [button]
	$('button.selectAll').click(function() {
		$('.endNodeCheckbox').each(function(i) {
			$(this).prop('checked', true);
		});
		XML2Table.views.renderTable(nm);
	});

	// Select 1-4 [button]
	$('button.select1-4').click(function() {
		for (var i=0; i<4; i++) {
			console.log(i);
			//console.log($('.endNodeCheckbox').eq(i).prop('checked'));
			$('.endNodeCheckbox').eq(i).prop('checked', true);
		}
		XML2Table.views.renderTable(nm);
	});

});

/* Table styling */
var styleTable = function() {
	/* For zebra striping */
    $("table tr:nth-child(odd)").addClass("odd-row");
	/* For cell text alignment */
	$("table td:first-child, table th:first-child").addClass("first");
	/* For removing the last border */
	$("table td:last-child, table th:last-child").addClass("last");
};