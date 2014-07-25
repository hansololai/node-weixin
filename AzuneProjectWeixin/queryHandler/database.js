/**
 * New node file
 */
 var sqlite = require('sqlite3').verbose();
var db;
var Q=require('q');
function init(){
	if(!db)
	db = new sqlite.Database("../Data/data.dat");
}
var databaseFunctions={};

function saveMessage(){
	
}
function getMessages(){
	
}
function setReplied(){
	
}
function uploadMedia(){
	
}
function addMember(){
	
}
function setMember(){
	
}
function isMember(){
	
}
function getReplyMessage(){
	
}
function addReplyMessage(){
	
}
function updateReplyMessage(){
	
}
function getReplyMaterial(){
	
}
function addReplyMaterial(){
	
}
function updateReplyMaterial(){
	
}
function getAllFans(){
	
}
function updateAllFans(){
	
}

