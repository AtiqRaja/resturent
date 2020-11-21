"use strict";
var KTDatatablesDataSourceAjaxServer = function() {
 var i = 1;
	var initTable1 = function() {
		var table = $('#kt_datatable');

		// begin first table
		table.DataTable({
			responsive: true,
            Paginate: true,
			ajax: {
				url: '/admin/preferences/get_all_preferences',
				type: 'GET',
				data: {
					// parameters for custom backend script demo
					columnsDef: [
						 'pref_title',
						'pref_min_value', 'pref_max_value',
						'status'],
				},
			},
			columns: [
				{data: function () {
                    return i++;
                }},
				{data: 'pref_title'},
				{data: 'pref_min_value'},
				{data: 'pref_max_value'},
				{data: 'status'},
				{data: null, responsivePriority: -1},
			],
			columnDefs: [
				{
					targets: -1,
					title: 'Actions',
					orderable: false,
					render: function(data, type, full, meta) {
						return '\
							<a href="/admin/preferences/edit/'+data._id+'" class="btn btn-sm btn-clean btn-icon" title="Edit details">\
								<i class="la la-edit"></i>\
							</a>\
							<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
								<i class="la la-trash"></i>\
							</a>\
						';
					},
				},
				{
					width: '75px',
					targets: -2,
					render: function(data, type, full, meta) {
						var status = {
							active: {'title': 'Active', 'class': 'label-light-primary'},
							2: {'title': 'Delivered', 'class': ' label-light-danger'},
							3: {'title': 'Canceled', 'class': ' label-light-primary'},
							4: {'title': 'Success', 'class': ' label-light-success'},
							5: {'title': 'Info', 'class': ' label-light-info'},
							6: {'title': 'Danger', 'class': ' label-light-danger'},
							7: {'title': 'Warning', 'class': ' label-light-warning'},
						};
						if (typeof status[data] === 'undefined') {
							return data;
						}
						return '<span class="label label-lg font-weight-bold ' + status[data].class + ' label-inline">' + status[data].title + '</span>';
					},
                }
			],
		});
	};

	return {

		//main function to initiate the module
		init: function() {
			initTable1();
		},

	};

}();

jQuery(document).ready(function() {
	KTDatatablesDataSourceAjaxServer.init();
});
