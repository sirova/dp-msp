(function () {
	angular
		.module('app')
		.controller('Controller', ['$scope', '$window', Controller]);

	function Controller($scope, $window) {

		// All data, startup data, no startup data
		var data = $window.data;
		var dataStartup = [];
		var dataNoStartup = [];

		// Filter data by startup: true/false
		var item;
		for (var i in data) {
			item = data[i];
			if (item.startup === "Yes") {
				dataStartup.push(item);
			} else {
				dataNoStartup.push(item);
			}
		}

		// Change Doughnut legendTemplate
		Chart.types.Doughnut.extend({
			defaults: {
				legendTemplate : "" +
					"<ul class=\"<%=name.toLowerCase()%>-legend\">" +
						"<% var count=0; %>" +
						"<% $.each(segments,function() {count += this.value;});%>" +
						"<% function totalCount(segments){val};%>" +
						"<% for (var i=0; i<segments.length; i++){%>" +
						"<li>" +
							"<span style=\"background-color:<%=segments[i].fillColor%>\"></span>" +
							"<%if(segments[i].label){%><%=segments[i].label%>" +
							" (<%= Math.round(100 * segments[i].value / count) %>%)" +
							"<%}%>" +
						"</li>" +
						"<%}%>" +
					"</ul>"
			}
		});

		// Setup view model
		$scope.vm = {
			charts: {
				// Background of the company
				startup: {
					labels: ["Yes", "No"],
					data: [dataStartup.length, dataNoStartup.length]
				},
				businessArea: getCompleteChartInfo(dataStartup, dataNoStartup, "businessArea", ["Telecommunication/IT", "Software house/software consulting", "Administrative services"]),
				international: getCompleteChartInfo(dataStartup, dataNoStartup, "international", ["Yes", "No"]),
				iso: getCompleteChartInfo(dataStartup, dataNoStartup, "iso", ["ISO 10006", "None"]),

				// Background of the project management software
				softwareManagementTools: getCompleteChartInfo(dataStartup, dataNoStartup, "softwareManagementTools", ["Yes", "No"]),
				tool: getCompleteChartInfo(dataStartup, dataNoStartup, "tool", ["Atlassian Jira", "None", "Microsoft Project", "Trello"]),
				license: getCompleteChartInfo(dataStartup, dataNoStartup, "license", ["Licensed", "Free", "None"]),

				// Methods of project management
				processes: getCompleteChartInfo(dataStartup, dataNoStartup, "processes", ["Yes", "No", "Don't know"]),
				projectManager: getCompleteChartInfo(dataStartup, dataNoStartup, "projectManager", ["Yes", "No"]),
				resultsAnalysis: getCompleteChartInfo(dataStartup, dataNoStartup, "resultsAnalysis", ["Yes", "No"]),

				// Feedback on the software management projects
				importanceOfSm: getCompleteChartInfo2D(dataStartup, dataNoStartup, "importanceOfSm", [1,2,3,4,5]),
				satisfaction: getCompleteChartInfo2D(dataStartup, dataNoStartup, "satisfaction", [1,2,3,4,5]),
				difficulty: getCompleteChartInfo2D(dataStartup, dataNoStartup, "difficulty", [1,2,3,4,5]),
				pmQuality: getCompleteChartInfo2D(dataStartup, dataNoStartup, "pmQuality", [1,2,3,4,5])
			}
		};

		// console.log($scope.vm);
	}

	/**
	 * Returns complete chart info for specified propertyName
	 * @param dataStartup
	 * @param dataNoStartup
	 * @param propertyName
	 * @param [startingLabels]
	 * @returns {{startup: {labels: Array, data: Array}, noStartup: {labels: Array, data: Array}}}
	 */
	function getCompleteChartInfo(dataStartup, dataNoStartup, propertyName, startingLabels) {

		return {
			startup: getChartInfo(dataStartup, propertyName, startingLabels),
			noStartup: getChartInfo(dataNoStartup, propertyName, startingLabels)
		}
	}

	/**
	 * Simply converts data from getCompleteChartInfo to support bar chart
	 * @param dataStartup
	 * @param dataNoStartup
	 * @param propertyName
	 * @param [startingLabels]
	 * @returns {{startup: {labels: *, data: *[]}, noStartup: {labels: *, data: *[]}}}
	 */
	function getCompleteChartInfo2D(dataStartup, dataNoStartup, propertyName, startingLabels) {
		var values = {
			startup: getChartInfo(dataStartup, propertyName, startingLabels),
			noStartup: getChartInfo(dataNoStartup, propertyName, startingLabels)
		};

		normalize2DChartInfo(values.startup);
		normalize2DChartInfo(values.noStartup);

		return {
			startup: {
				labels: values.startup.labels,
				data: [values.startup.data]
			},
			noStartup: {
				labels: values.noStartup.labels,
				data: [values.noStartup.data]
			}
		};
	}

	/**
	 * Removes labels with "0" text from chart info
	 * @param chartInfo
	 */
	function normalize2DChartInfo(chartInfo) {
		var index;
		if((index = chartInfo.labels.indexOf(0)) != -1) {
			chartInfo.labels.splice(index, 1);
			chartInfo.data.splice(index, 1);
		}
	}

	/**
	 * Returns 1D chart data
	 * @param items
	 * @param propertyName
	 * @param [startingLabels]
	 * @returns {{labels: Array, data: Array}}
	 */
	function getChartInfo(items, propertyName, startingLabels) {

		var startingData;
		if(startingLabels) {
			// Initialize data array with 0 values with same length as labels
			startingData = Array.apply(null, new Array(startingLabels.length)).map(Number.prototype.valueOf, 0);
		}else{
			startingLabels = [];
			startingData = [];
		}

		var chartInfo = {
			labels: startingLabels.slice(), // We need to make copy to prevent changing startingLabels param
			data: startingData
		};

		// Iterate over items and calculate counts of different values
		var value, pos;
		for (var i in items) {
			value = items[i][propertyName];

			// If value type already exists
			if ((pos = chartInfo.labels.indexOf(value)) != -1) {
				// Increment respective data value
				chartInfo.data[pos]++;
			} else {
				// Create new label and set respective data value to 1
				chartInfo.labels.push(value);
				chartInfo.data.push(1);
			}
		}

		// Sort data by legend alphabetically
		var origLabels = chartInfo.labels.slice();

		return chartInfo;
	}

})();