import Moment from 'moment';
import axios from 'axios';
import store from './../ducks/store';
import { addToUser } from './../ducks/User';
// import { Redirect } from 'react-router-dom'
import React from 'react';
// eslint-disable-next-line
String.prototype.toProper = function() {
	let str = this;
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};
// eslint-disable-next-line
String.prototype.keyword = function() {
	let str = this;
	if (str.includes('☀')) {
		// let assign = str => {
		// 	let item = str.split('.')[1];
		// 	if (item === 'first_name') {
		// 		return 'Ryan';
		// 	}
		// };
		str = str.split(' ');
		let items = str.map((e, i) => {
			if (e.includes('☀')) {
				// let com = e.includes(',');
				e = e.split('☀')[1];
				return <p style={{ backgroundColor: 'blue' }}>{e}</p>;
				// return com ? assign(e) + ',' : assign(e);
			} else {
				return e;
			}
		});
		return items.join(' ').replace(/ ,/gi, ',');
	} else {
		return str;
	}
};
// eslint-disable-next-line
String.prototype.emailValidate = function() {
	let str = this;
	// eslint-disable-next-line
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(str).toLowerCase());
};
// eslint-disable-next-line
Array.prototype.push2 = function(x) {
	this.push(x);
	return this;
};
// eslint-disable-next-line
Array.prototype.uniq = function() {
	return this.reduce(function(a, b) {
		if (a.indexOf(b) < 0) a.push(b);
		return a;
	}, []);
};
// let one = [1, 2, 3, 3];
// let two = [4, 5, 6];
export let dateSorting = arr => {
	return arr.sort((a, b) => new Moment(a).format('YYYYMMDD') - new Moment(b).format('YYYYMMDD'));
};
export let getUserInfo = async () => {
	await axios.get('/api/get-session').then(async res => {
		let state = store.getState();
		if (!state.User.user.user) {
			if (!res.data.msg) {
				await store.dispatch(addToUser(res.data));
			} else {
			}
		}
	});
};
export const pagination = (arr, current, perPage) => {
	const indexOfLastItem = current * perPage;
	const indexOfFirstItem = indexOfLastItem - perPage;
	const currentItems = arr.slice(indexOfFirstItem, indexOfLastItem);
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(arr.length / perPage); i++) {
		pageNumbers.push(i);
	}
	return { arr: currentItems, pages: pageNumbers };
};
export const toTitleCase = str => {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

export default {
	dateSorting,
	getUserInfo,
	pagination,
	toTitleCase,
};
