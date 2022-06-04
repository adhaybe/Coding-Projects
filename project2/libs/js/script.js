// -------------------------------- Global Variables -------------------------------------

// array containers
var currentLocation = [];
var currentDepartment = [];

// stores department and location id
let currentSelectedEmployeeID;
let currentSelectedLocationName;
let currentSelectedLocationID;


// -------------------------------- Employee CRUD operations-------------------------------------

// Ajax call for Creating New Employee Information
const createEmployeeInfo = () => {
    // Add User Modal
    $(`#addUser`).on('click', async () => {
    
        $('.modal-backdrop').show(); // Show the grey overlay.

        // program must await here for department data
        await getDepartmentsByUser();
        let selectDepartment = ``;

        // loop through department data
        for(i=0; i<currentDepartment.length; i++){
            selectDepartment += `<option value="${currentDepartment[i].id}">${currentDepartment[i].department}</option>`
        }

        // add the department to the populate form
        $('#add_user_department').html(selectDepartment);

        updateAddEmployeeLocation(); // calls this function to retrieve location data from database

        // update location each time a new department is selected        
        $("#add_user_department").change(() => {
            updateAddEmployeeLocation();
        });

    });

    // ajax call that adds new employee information based on user input
    $("#newUserForm").submit((event) => {
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            type: 'POST',
            url: "libs/php/insertUser.php",
            data: {
                firstName: $('#add_user_firstName').val(),
                lastName: $('#add_user_lastName').val(),
                email: $('#add_user_email').val(),
                jobTitle: $('#add_user_jobTitle').val(),
                departmentID: $('#add_user_department').val()
            },
            dataType: 'json',
            async: false,
            success: () => {
                location.reload();
            },
            error: (error) => console.log(error)
        })
    });
}

// Ajax call for Retrieving Existing Employee Information
const retrieveEmployeeInfo = () => {
    $('.tableRow').click((event) => {
        // display modal
        $('#userSelectModal').modal('show');
        currentSelectedEmployeeID = event.currentTarget.id; // stores the selected employee id from the table
        
        $.ajax({
            type: 'GET',
            url: 'libs/php/getPersonnelByID.php',
            dataType: 'json',
            data: {
                id: currentSelectedEmployeeID
            },
            asnyc: false,
            success: (result) => {
        
                // stores employee data from database
                const data = result['data']; // stores employee data in a variable
                const personnel = data.personnel[0]; // stores the retreived user data

                // populate modal with employee information
                $('#userSelectModalLabel').html(`${personnel.firstName} ${personnel.lastName}`);
                $('#user_id').val(personnel.id);
                $('#user_firstName').val(personnel.firstName);
                $('#user_lastName').val(personnel.lastName);
                $('#user_email').val(personnel.email);
                $('#user_jobTitle').val(personnel.jobTitle);
                $('#user_department').val(personnel.department);
                $('#user_location').val(personnel.location);
                $("#edit").attr("userID", personnel.id);
                
            },
            error: (error) => console.log(error) // log error message
        });
    });
}

// Ajax call for Updating Existing Employee Information
const updateEmployeeInfo = () => {
    $('#edit').click( async () => {

        // display employee edit modal
        $("#userEditModal").modal('show'); 
        $('.modal-backdrop').show(); // Show the grey overlay.
       
        let personnel;
        // use ajax call to generate existing employee details
        // must await ajax to get hold of personnel data first
        await $.ajax({
            type: "GET",
            url: "libs/php/getPersonnelByID.php",
            data: {
                id: $("#edit").attr("userID")
            },
            dataType: 'json',
            asnyc: false,
            success:  (result) => {
                // store employee data from database
                const data = result['data'];
                personnel = data.personnel[0];
    
                // generate existing employee data
                $('#edit_user_firstName').val(personnel.firstName);
                $('#edit_user_lastName').val(personnel.lastName);
                $('#edit_user_email').val(personnel.email);
                $('#edit_user_jobTitle').val(personnel.jobTitle);
                $("#editUserConfirm").attr("userID", personnel.id);
            },
            error: (error) => console.log(error) // log error message
        });

                // program must await here for function to generate departments and access department array data
                await getDepartmentsByUser();

                        
                let selectDepartment = "";
            
                // loop through data    
                for (let i = 0; i < currentDepartment.length; i++) {
                    if(currentDepartment[i].department == personnel.department){
                        selectDepartment += `<option value="${currentDepartment[i].id}" selected="selected">${currentDepartment[i].department}</option>`
                    } else {
                        selectDepartment += `<option value="${currentDepartment[i].id}">${currentDepartment[i].department}</option>`
                    }
                }

                $('#edit_user_department').html(selectDepartment);
                $('#edit_user_location').html(personnel.location);


        // populate location data on depatment change
        $("#edit_user_department").change(() => {
            
            let selectLocation = "";
            let locationID = document.getElementById('edit_user_department').value;

            console.log(locationID);
            
            for(let i=0; i < currentDepartment.length; i++){
                if (currentDepartment[i]['id'] == locationID){
                    selectLocation = `${currentDepartment[i]['location']}`
                }
            }
            
            $('#edit_user_location').html(selectLocation);
        });

           // Confirm edit submit form
            $("#editUserForm").submit((e) => {

                e.preventDefault();
                e.stopPropagation();

                $.ajax({
                    type: 'POST',
                    url: "libs/php/updateUser.php",
                    data: {
                        firstName: $('#edit_user_firstName').val(),
                        lastName: $('#edit_user_lastName').val(),
                        email: $('#edit_user_email').val(),
                        jobTitle: $('#edit_user_jobTitle').val(),
                        departmentID: $('#edit_user_department').val(),
                        id: $("#editUserConfirm").attr("userID")
                    },
                    dataType: 'json',
                    async: false,
                    success: () => {
                        location.reload();
                    },
                    error: (error) => console.log(error)
                }); 
            });
    });
}

// Ajax call for Deleting Existing Employee Information
const deleteEmployeeInfo = () => {
    $("#delete").click(() => {      
        
        $("#userDeleteModal").modal('show');      
        $('#deleteConfirm').html(`${$('#userSelectModalLabel').html()}<br>`);
      
        $(`#delUserConfirm`).on('click', (event) => {     
            $.ajax({
                type: 'POST',
                url: "libs/php/deleteUserByID.php",
                data: {
                    id: currentSelectedEmployeeID,
                },
                dataType: 'json',
                async: false,
                success: (result) => {
                    location.reload();
                    
                },
                error: (error) => console.log(error)
            }); 

            event.stopPropagation();
        });
    });
}

// -------------------------------- Department CRUD operations-------------------------------------

// Ajax call for Creating New Departments
const createNewDepartment = () => {
    $("#addDepartment").click(async () => {      
            
        document.getElementById('newDepName').value = ""; // await user input for new department name

        // program must then await here for location data
        await getLocations();

        // location data will be used to populate the select location field
        let locationSelection = "";
        for(i=0; i<currentLocation.length; i++){
            locationSelection += `<option value="${currentLocation[i].id}">${currentLocation[i].location}</option>`
        }

        $('#newDepLocation').html(locationSelection);
    });

    // ajax call will insert a new employee upon successful submission
    $("#addDepForm").submit((e) => {

        e.preventDefault();
        e.stopPropagation();

        $.ajax({
            type: 'GET',
            url: "libs/php/insertDepartment.php",
            data: {
                name: $('#newDepName').val(),
                locationID: $('#newDepLocation').val()
            },
            dataType: 'json',
            async: false,
            success: () => {
                location.reload();
            },
            error: (error) => console.log(error)
        });
    });
}

// Ajax call for Displaying Departments
const retrieveDepartmentInfo = () => {
    $('#departments').on('click', () => {
        $.ajax({
            type: 'GET',
            url: "libs/php/getDepartmentsByUser.php",
            data: {},
            dataType: 'json',
            async: false,
            success: (result) => {
    
                // retrieve data from database
                let data = result["data"];
                let departmentContainer = [];
                let departmentHTML = ``;
    
                // loop through data and push contents into array
                for(let i=0; i < data.length; i++){
                    departmentContainer.push(data[i]);
                }
    
                // loop through contents and populate data to html table
                for(let i=0; i < departmentContainer.length; i++){
                    departmentHTML += `<tr id="${departmentContainer[i].id}" class=" departmentEdit depTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#departmentEditModal" title="${departmentContainer[i].department}" location="${departmentContainer[i].locationID}" users="${departmentContainer[i].users}" departmentid="${departmentContainer[i].id}"><td class="tableIcon"><i class="fas fa-building"></i></td><td scope="row" class="department"> ${departmentContainer[i].department} </td><td scope="row" class="department_location"> ${departmentContainer[i].location} </td>`;
                }

                $('#departmentsList').html(departmentHTML);
            },
            error: (error) => console.error(error)
        })
    });
}

// Ajax call for Updating Departments
const updateDepartmentInfo = () => {
    $('#departmentsList').on('click','tr',async (event) => {

        let currentSelectRow = event.currentTarget;
        $('.modal-backdrop').show(); // Show the grey overlay.
        $('#editDepName').val(`${currentSelectRow.title}`);
        $('#editDepForm').attr("depID", `${currentSelectRow.attributes.departmentid.value}`);
        
        let depID = currentSelectRow.id;
        let locID = currentSelectRow.attributes.location.value;
        
        // condition for checking if a departmet has no users we can delete otherwise delete will display modal error message
        if (currentSelectRow.attributes.users.value == 0){
            $("#deleteDepBtn").show();
            $("#departmentDelete").attr("departmentName",currentSelectRow.attributes.title.value);
            $("#departmentDelete").attr("departmentid",currentSelectRow.attributes.departmentid.value);
        } else {
            document.getElementById('deleteDepBtn').innerHTML = "Unable to delete department with active users";  
        }

        // program must await here for location data
        await getLocations();
        
        // loop through location data and populate form
        let locationSelection = "";
        for(i=0; i<currentLocation.length; i++){
            
            if(currentLocation[i].id == locID){
                locationSelection += `<option value="${currentLocation[i].id}" selected="selected">${currentLocation[i].location}</option>`
            }
            else {
                locationSelection += `<option value="${currentLocation[i].id}">${currentLocation[i].location}</option>`
            }
        }
        $('#editDepLocation').html(locationSelection);
    });

    // updates department information when the new department details are submitted
    $("#editDepForm").submit((event) => {

        // prevents the event from further propagating
        event.preventDefault();
        event.stopPropagation();
    
        $.ajax({
            type: 'POST',
            url: "libs/php/updateDepartment.php",
            data: {
                name: $('#editDepName').val(),
                locationID: $('#editDepLocation').val(),
                departmentID: $('#editDepForm')[0].attributes.depid.value
            },
            dataType: 'json',
            async: false,
            success: () => {
                location.reload();
            },
            error: (error) => console.log(error)
        });
    });
}

// Ajax call for Deleting Departments
const deleteDepartmentInfo = () => {
    $("#departmentDelete").click(function(){      
    
        $('.modal-backdrop').show(); // Show the grey overlay.
        $('#delDepName').html(`${this['attributes']['departmentName']['value']}`);

        var depID = this.attributes.departmentid.value;
        
        $("#delDepConfirm").click(() => { 
            var depIDInt = parseInt(depID)
            
            $.ajax({
                type: 'POST',
                url: "libs/php/deleteDepartmentByID.php",
                data: {
                    id: depIDInt,
                },
                dataType: 'json',
                async: false,
                success: () => {
                    location.reload();
                }, 
                error: (error) => console.log(error)
            });
        });
    });
}

// -------------------------------- Location CRUD operations-------------------------------------

// Ajax call for displaying existing locations
const retrieveLocationInfo = () => {
    $('#locations').on('click', () => {
        $.ajax({
            type: 'GET',
            url: "libs/php/getLocations.php",
            data: {},
            dataType: 'json',
            async: false,
            success: (result) => {
                // store database information
                let data = result["data"];
                let locArray = [];
                let loc_html = ``;

                // loop through database contents and push elements into array container
                for(let i=1; i < data.length; i++){
                    locArray.push(data[i]);
                }

                // loop through array contents and populate elements into html
                for(let i=0; i < locArray.length; i++){
                    loc_html += `<tr id="${locArray[i].id}" class=" locationEdit locTableRow" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#locationEditModal" locationName="${locArray[i].location}" locationID="${locArray[i].id}" departments="${locArray[i].departments}"><td scope="row" class="locationHeader">${locArray[i].location}</td></tr>`;
                }

                $('#locationsList').html(loc_html);
            },
            error: (error) => console.log(error)
        });
    });
}

// Ajax call for creating a new locations
const createNewLocation = () => {
    $("#addLocForm").submit((event) => {
        // prevents the event from further propagating and cancels it
        event.preventDefault();
        event.stopPropagation();
        $.ajax({
            type: 'POST',
            url: "libs/php/insertLocation.php",
            data: {
                name: $('#newLocName').val(),
            },
            dataType: 'json',
            async: false,
            success: () => {
                location.reload();
            },
            error: (error) => console.log(error)
        });
    });
}

// Ajax call for updating locations
const updateLocation = () => {

    // retrieves the id of the selected location
    $('#locationsList').on('click','tr', async (event) => {

        let currentSelectRow = event.currentTarget;

        currentSelectedLocationName = currentSelectRow.attributes.locationname.value;
        currentSelectedLocationID = currentSelectRow.attributes.locationid.value;

        $('#edit_location_name').val(`${currentSelectedLocationName}`);
    });

    // updates the location name based on user input
    $("#editLocForm").submit((event) => {

        // prevents the event from further propagating and cancels it
        event.preventDefault();
        event.stopPropagation();
 
        $.ajax({
            type: 'POST',
            url: "libs/php/updateLocation.php",
            data: {
                name: $('#edit_location_name').val(),
                locationID: currentSelectedLocationID,
            },
            dataType: 'json',
            async: false,
            success: () => {
                location.reload();
            },
            error: (error) => console.log(error) 
        });
    });
}

// Ajax call for updating locations
const deleteLocation = () => {
    $("#locationDelete").click(() => {
            
        $('#delLocName').html(`${currentSelectedLocationName}`);   
        $("#delLocForm").submit((event) => {

            // prevents the event from further propagating and cancels it
            event.preventDefault();
            event.stopPropagation();

            $.ajax({
                type: 'POST',
                url: "libs/php/deleteLocationByID.php",
                data: {
                    locationID: currentSelectedLocationID,
                },
                dataType: 'json',
                async: false,
                success: (results) => {
                    location.reload();
                },
                error: (error) => console.log(error)
            });
        });
    });
}

// -------------------------------- Helper Functions -------------------------------------

// retrieves departments from database
const getDepartmentsByUser = () => new Promise ((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: "libs/php/getDepartmentsByUser.php",
            data: {},
            dataType: 'json',
            async: false,
            success: (results) => {
    
                currentDepartment = [];
                let data = results["data"];
    
                for(let i=0; i < data.length; i++){
                    currentDepartment.push(data[i]);
                }
                resolve();
            },
            error: (error) => {
                console.log(error);
                reject(error);
            }
        });  
});

// retrieves locations from database
const getLocations = () => new Promise((resolve, reject) => {
    $.ajax({
        type: 'GET',
        url: "libs/php/getLocations.php",
        data: {},
        dataType: 'json',
        async: false,
        success: function(result) {

            currentLocation = [];
            let data = result["data"];

            for(let i=0; i < data.length; i++){
                currentLocation.push(data[i]);
            }
            resolve();
        },
        error: () => reject()
    })   
});

// populates the location form in the user add modal
const updateAddEmployeeLocation = () => {
    // function that populates employee department location
    let selectLocation = "";
    let locationID = document.getElementById('add_user_department').value;
    
    // loop through database and push location data into the form
    for(let i=0; i < currentDepartment.length; i++){
        if (currentDepartment[i]['id'] == locationID){
            selectLocation = `${currentDepartment[i]['location']}`
        }
    }
    
    $('#add_user_location').html(selectLocation);
}

// displays table of contents with information from database
const populateTable = () => {
    $.ajax({
        type: 'GET',
        url: 'libs/php/getAll.php',
        data: {},
        dataType: 'json',
        async: false,
        success: (result) => {

            // variables for populating the user data into the table
            const tableData = result['data'];
            let users = [];
            let htmlTable = ``;

            // loop through the database and pushes those elements into a user array
            for (let i=0; i < tableData.length; i++) {
                users.push(tableData[i]);
            }

            // loops through each html element and adds users data to the html table
            for (let i=0; i < tableData.length; i++) {
                htmlTable += `<tr class="tableRow" id="${users[i].id}"><td scope="row" class="tableIcon"><i class="fas fa-user-circle fa-lg"></i></td><td scope="row">${users[i].firstName}</td><td scope="row">${users[i].lastName}</td><td scope="row" class="hider1">${users[i].email}</td><td scope="row" class="hider1">${users[i].jobTitle}</td><td scope="row" class="hider2">${users[i].department}</td><td scope="row" class="hider2">${users[i].location}</td></tr>`;
            }

            $('#mainTable').html(htmlTable); 
        },
        error: (error) => console.log(error) 
    });
};

// populates the table with specific data from user search criteria
const displaySearchResult = (result) => {

    // retrieve personnel data from ajax call
    let data = result["data"];
    let personnel = data['personnel'];                   
    let search_html_table = "";

    if(personnel.length == 0) {
       
        $('#notFound').modal('show');

    }   else {
        // loop through array and populate the table with personnel data
         for(i=0; i < personnel.length; i++){
        
            search_html_table += `<tr class="tableRow" id="${personnel[i].id}"><td scope="row" class="tableIcon"><i class="fas fa-user-circle fa-lg"></i></td><td scope="row">${personnel[i].firstName}</td><td scope="row">${personnel[i].lastName}</td><td scope="row" class="hider1">${personnel[i].email}</td><td scope="row" class="hider1">${personnel[i].jobTitle}</td><td scope="row" class="hider2">${personnel[i].department}</td><td scope="row" class="hider2">${personnel[i].location}</td></tr>`;

            }


            $('#sqlTable').find('tbody').html(`${search_html_table}`);
        
            // retrieve employee data to reattach event handlers to newly generated table
            retrieveEmployeeInfo();
    }

  
};

// enables you to search for specific employees, departments and locations
const searchInfo = () => {
    $("#search-submit").click(() => {
        let selectOptions = $('#searchSelect').val();
   
        // switch statement that performs a search based on user input criteria
        switch(selectOptions) {
            // ajax call for first name search
            case "firstName":
                $.ajax({
                    type: 'GET',
                    url: "libs/php/search_firstName.php",
                    data: {
                        search: "%" + document.getElementById("searchField").value + "%"
                    },
                    dataType: 'json',
                    async: false,
                    success: (result) => {
                       
                         displaySearchResult(result); // function that will populate the database with search criteria
                      
                    },
                    error: (error) => console.log(error) // log error message
                });
                break;

            // ajax call for last name search
            case "lastName":           
                    $.ajax({
                        type: 'GET',
                        url: "libs/php/search_lastName.php",
                        data: {
                            search: "%" + document.getElementById("searchField").value + "%"
                        },
                        dataType: 'json',
                        async: false,
                        success: (result) => {
                            displaySearchResult(result); // function that will populate the database with search criteria
                            console.log(result);
                        },
                        error: (error) => console.log(error) // log error message
                    });
                break;

            // ajax call for department search
            case "email":
                    $.ajax({
                        type: 'GET',
                        url: "libs/php/search_email.php",
                        data: {
                            search: "%" + document.getElementById("searchField").value + "%"
                        },
                        dataType: 'json',
                        async: false,
                        success: (result) => {
                            displaySearchResult(result);
                        },
                        error: (error) => console.log(error)
                    });
                break;

            // ajax call for Job Title search
            case "jobTitle":
                    $.ajax({
                        type: 'GET',
                        url: "libs/php/search_jobTitle.php",
                        data: {
                            search: "%" + document.getElementById("searchField").value + "%"
                        },
                        dataType: 'json',
                        async: false,
                        success: (result) => {
                            displaySearchResult(result);
                        },
                        error: (error) => console.log(error)
                    });
                break;
            
            // ajax call for department search
            case "department":
                    $.ajax({
                        type: 'GET',
                        url: "libs/php/search_department.php",
                        data: {
                            search: "%" + document.getElementById("searchField").value + "%"
                        },
                        dataType: 'json',
                        async: false,
                        success: (result) => {
                            displaySearchResult(result);
                        },
                        error: (error) => console.log(error)
                    }); 
                break;

            // ajax call for location search
            case "location":
                    $.ajax({
                        type: 'GET',
                        url: "libs/php/search_location.php",
                        data: {
                            search: "%" + document.getElementById("searchField").value + "%"
                        },
                        dataType: 'json',
                        async: false,
                        success: (result) => {
                            displaySearchResult(result);
                        },
                        error: (error) => console.log(error)
                    });
                break;
        }
        
    });        

    // Get the input field
    let searchBtnClick = document.getElementById("searchField");

    // Execute a function when the user presses a key on the keyboard
    searchBtnClick.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("search-submit").click();
    }
});


}

// -------------------------------- Document Ready Call -------------------------------------
$(document).ready(() => {
    
    // displays table with employee, department, and location information
    populateTable();

    // CRUD operation for employees
    createEmployeeInfo(); // add news employee information to database
    retrieveEmployeeInfo(); // displays employee information in a modal window
    updateEmployeeInfo(); // edits employee information in a modal window
    deleteEmployeeInfo(); // deletes employee from database

    // CRUD operations for departments
    createNewDepartment(); // creates a new department
    retrieveDepartmentInfo(); // displays existing department information in a modal
    updateDepartmentInfo(); // updates department information in a modal window
    deleteDepartmentInfo(); // deletes department information in a modal window

    // CRUD operations for locations
    createNewLocation(); // creates a new location
    retrieveLocationInfo(); // displays existing location information in a modal
    updateLocation(); // edits location information in a modal window
    deleteLocation(); // deletes location information in a modal window

    // search function
    searchInfo(); // allows you to search for specific information from directory

});