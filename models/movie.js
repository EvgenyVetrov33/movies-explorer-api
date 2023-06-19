const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
	country: {
		type: String,
		required: [true, 'поле "country" не может быть пустым'],
	},
	director: {
		type: String,
		required: [true, 'поле "director" не может быть пустым'],
	},
	duration: {
		type: Number,
		required: [true, 'поле "duration" не может быть пустым'],
	},
	year: {
		type: String,
		required: [true, 'поле "year" не может быть пустым'],
	},
	description: {
		type: String,
		required: [true, 'поле "description" не может быть пустым'],
	},
	image: {
		type: String,
		required: [true, 'поле "image" не может быть пустым'],
		validate: {
			validator: (v) => validator.isURL(v),
			message: 'Неверный формат ссылки на изображение',
		},
	},
	trailer: {
		type: String,
		required: [true, 'поле "trailer" не может быть пустым'],
		validate: {
			validator: (v) => validator.isURL(v),
			message: 'Неверный формат ссылки на трейлер',
		},
	},
	thumbnail: { // миниатюрное изображение постера к фильму
		type: String,
		required: [true, 'поле "thumbnail" не может быть пустым'],
		validate: {
			validator: (v) => validator.isURL(v),
			message: 'Неверный формат ссылки на изображение',
		},
	},
	owner: { // _id пользователя, который сохранил фильм
		type: mongoose.Types.ObjectId,
		required: [true, 'поле "owner" не может быть пустым'],
	},
	movieId: { // _id фильма, который содержится в ответе сервиса MoviesExplorer
		type: Number,
		required: [true, 'поле "movieId" не может быть пустым'],
	},
	nameRU: {
		type: String,
		required: [true, 'поле "nameRU" не может быть пустым'],
	},
	nameEN: {
		type: String,
		required: [true, 'поле "nameEN" не может быть пустым'],
	},
});

// задаем составной индекс, для блокировки повторного сохранения фильма пользователем
movieSchema.index({ owner: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('movie', movieSchema);