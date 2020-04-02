/*********************************************************************************
*  WEB422 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Oleh Ivanyshyn Student ID: 125165167 Date: September 28, 2018
*
*
********************************************************************************/ 

var viewModel = {
    teams: [],
    employees: [],
    projects: []
};

function showGenericModal(title, message) {
    $(".modal-title").append(title);
    $(".modal-body").append(message);
    $("#genericModal").modal("show");
}

function initializeTeams() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://web422-app.herokuapp.com/teams-raw", 
            type: "GET",
            contentType: "application/json"
        })
        .done(function (data) {
            viewModel.teams = ko.mapping.fromJS(data);
            resolve();
        })
        .fail(function () {
            reject("Error loading team data.");
        });
    })
}

function initializeEmployees() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://web422-app.herokuapp.com/employees", 
            type: "GET",
            contentType: "application/json"
        })
        .done(function (data) {
            viewModel.employees = ko.mapping.fromJS(data);
            resolve();
        })
        .fail(function () {
            reject("Error loading employee data.");
        });
    })
}

function initializeProjects() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://web422-app.herokuapp.com/projects", 
            type: "GET",
            contentType: "application/json"
        })
        .done(function (data) {
            viewModel.projects = ko.mapping.fromJS(data);
            resolve();
        })
        .fail(function () {
            reject("Error loading project data.");
        });
    })
}

function saveTeam() {
    let currentTeam = this;
    $.ajax({
        url: "https://web422-app.herokuapp.com/team/" + currentTeam._id(), 
        type: "PUT",
        data: data = JSON.stringify({   Projects: currentTeam.Projects(),
                                        Employees: currentTeam.Employees(),
                                        TeamLead: currentTeam.TeamLead()}),
        contentType: "application/json"
    })
    .done(function (data) {
        showGenericModal('Success', currentTeam.TeamName() + ' has been updated successfully.');
    })
    .fail(function (err) {
        showGenericModal('Error', 'There has been an error saving your team information.');
    });
}

$(function () {
    initializeTeams()
    .then(initializeEmployees)
    .then(initializeProjects)
    .then(function() {
        $(".loading").fadeOut("slow"); 
        ko.applyBindings(viewModel, $("body")[0]);
        $("select.multiple").multipleSelect({ filter: true });
        $("select.single").multipleSelect({ single: true, filter: true });
    })
    .catch(function(err) {
        showGenericModal('Error', err);
    });
    $('.modal').on('hidden.bs.modal', function () {
        $('.modal-title').empty();
        $('.modal-body').empty();
    })
});