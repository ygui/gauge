// CONNECTIONS OBJECT
connections = {

	// GET JSON
	makeConnection: function(url, group, httpRequest){
		httpRequest = new XMLHttpRequest();

		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState == 4 && httpRequest.status == 200) {
				var getArr = JSON.parse(httpRequest.responseText);
				groups[group].getJson(getArr);
			}
		};

		httpRequest.open("GET", url, true);
		httpRequest.send();
	}
};

// AUXILIARY OBJECT
auxFunctions = {

	// ADD USERS BY INTERACTIONS COUNTER
	addUserInteractions: function(array){
		var userArray = [];
		for(var item in array){
			userArray.push( [ window.usersList[ array[item][0] - 1 ], array[item][1] ]);
		}
		userArray.reverse();
		appendHTML.appendUser(userArray);
	}
};

// APPEND OBJECT
appendHTML = {

	// APPEND USERS
	appendUser: function(array){
		var table = '<table class="table">';
					table += '<thead>';
						table += '<td>';
							table += 'Position';
						table += '</td>';
						table += '<td>';
							table += 'Thumb';
						table += '</td>';
						table += '<td>';
							table += 'Name';
						table += '</td>';
						table += '<td>';
							table += 'Interactions';
						table += '</td>';
					table += '</thead>';

					table += '<tbody>';
						for(var item in array){
							var position = parseInt(item) +1;
							var thisItem = array[item];
							var thisFullName = thisItem[0].name.title +". "+ thisItem[0].name.first +" "+ thisItem[0].name.last;
							table += '<tr>';
								table += '<td>';
									table += position+'°';
								table += '</td>';
								table += '<td>';
									table += '<img src="'+thisItem[0].picture.thumbnail+'" alt="'+thisFullName+'">';
								table += '</td>';
								table += '<td>';
									table += thisFullName;
								table += '</td>';
								table += '<td>';
									table += thisItem[1];
								table += '</td>';
							table += '</tr>';
						}
					table += '</tbody>';
				table += "</table>";
		document.getElementById('result').innerHTML = table;
	},

	// APPEND BRANDS FILTER
	appendBrands: function(array){
		var options = "<option>All</option>";
		for(var item in array){
			options += '<option>';
				options += array[item].name;
			options += '</option>';
		}
		document.getElementById('filter').innerHTML = options;
	}
}

// GROUPS OBJECT
groups = {

	//USERS JSON
	users: {
		getJson: function(info){
			window.usersList = info;
		},

		getAll: function(){
			var arrayInteractions = window.interactionsList;
			arrayInteractions.sort(function(a,b){
				return a.user < b.user ? -1 : a.user > b.user ? 1 : 0;
			});

			var ordered = groups.interactions.sortCount(arrayInteractions);
			auxFunctions.addUserInteractions(ordered);
		},
	},

	// BRANDS JSON
	brands: {
		getJson: function(info){
			window.brandsList = info;
			appendHTML.appendBrands(info);
		},
		sortBrand: function(id){
			var arrayInteractions = window.interactionsList;
			arrayInteractions.sort(function(a,b){
				return a.user < b.user ? -1 : a.user > b.user ? 1 : 0;
			});

			var ordered = groups.interactions.sortCount(arrayInteractions, 'brand', id);
			auxFunctions.addUserInteractions(ordered);
		}
	},

	// INTERACTIONS JSON
	interactions: {
		getJson: function(info){
			window.interactionsList = info;
		},
		sortCount: function(array, filter, id){
			// REPETITION COUNTER
			var qnt = [], prev;
			var arrayLength = array.length;
			for ( var i = 0; i < arrayLength; i++ ) {
				if( id == array[i][filter] || id == 0){
					if ( array[i].user !== prev ) {
						qnt.push([array[i].user, 1]);
					} else {
						qnt[qnt.length-1][1]++;
					}
					prev = array[i].user;
				}
			}

			// SORT BY QUANTITY
			qnt.sort(function(a,b){
				return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
			});
			return qnt;
		}
	}
};

// LOAD ALL JSON
connections.makeConnection("assets/json/brands.json", "brands", "brandsCon");
connections.makeConnection("assets/json/interactions.json", "interactions", "interactionsCon");
connections.makeConnection("assets/json/users.json", "users", "usersCon");

//FUNCTIONS AFTER LOAD
(function(){
	setTimeout(function(){
		// GET ALL USERS WITHOUT FILTERS
		groups.users.getAll();

		// FILTER ACTION
		document.getElementById("filter").onchange = function(){
			groups.brands.sortBrand(this.selectedIndex);
		};

	}, 1000);
})(document);