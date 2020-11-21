"use strict";
var KTDatatablesDataSourceAjaxServer = function() {
 var i = 1;

 var _vars = [];
	var initTable1 = function() {
		var table = $('#kt_datatable');

	

		$.get("/admin/macros/get_all_variances", function(data, status){
			console.log("Data: " + data + "\nStatus: " + status);
			console.log(data);
			_vars = data._vars;
		  });


		// begin first table
		table.DataTable({
			responsive: true,
            Paginate: true,
			ajax: {
				url: '/admin/macros/get_all_macros',
				type: 'GET',
				data: {
					// parameters for custom backend script demo
					columnsDef: [
						 'macro_title',
						'macro_pref_value', 'macro_variances',
						'status'],
				},
			},
			columns: [
				{data: function () {
                    return i++;
                }},
				{data: 'macro_title'},
				{data: 'macro_pref_value'},
				{data: 'macro_variances'},
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
							<a href="/admin/macros/edit/'+data._id+'" class="btn btn-sm btn-clean btn-icon" title="Edit details">\
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
                },
                {
					width: '200px',
					targets: -3,
					render: function(data, type, full, meta) {

                        var vars = '';
                        console.log(typeof _vars);
                        data.forEach(d => {
                            _vars.forEach(v => {
								if (d.variance == v._id) {
									vars = vars+ '<span class="label label-lg font-weight-bold label label-dark label-inline m-1">' + v.variance + ' : ' + (d.value) +'% </span>';									
								}
						});
						});

						if (typeof data === 'undefined') {
							return data;
                        }
                        
						return vars;
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
