let preprocessor = 'sass';

const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

const babel = require('gulp-babel');

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'));
//const less = require('gulp-less');

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем compress-images для работы с изображениями
const imagecomp = require('compress-images');

// Подключаем модуль gulp-clean (вместо del)
const clean = require('gulp-clean');


function browsersync() {
  browserSync.init({ // Инициализация Browsersync
    server: { baseDir: 'app/' }, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true // Режим работы: true или false
  })
}


function scripts() {
  return src([ // Берем файлы из источников
    'app/js/main.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
  ])
    .pipe(concat('main.min.js')) // Конкатенируем в один файл
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src('app/scss/style.scss') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('style.min.css')) // Конкатенируем в файл style.min.css
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ })) // Минифицируем стили
    .pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

async function images() {
  imagecomp(
    "app/images/src/**/*", // Берём все изображения из папки источника
    "app/images/dest/", // Выгружаем оптимизированные изображения в папку назначения
    { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
    { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
    { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (err, completed) { // Обновляем страницу по завершению
      if (completed === true) {
        browserSync.reload()
      }
    }
  )
}

function cleanimg() {
  return src('app/images/dest/', { allowEmpty: true }).pipe(clean()) // Удаляем папку "app/images/dest/"
}

function startwatch() {
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
  // Мониторим файлы препроцессора на изменения
  watch('app/**/scss/**/*', styles);
  watch('app/**/*.html').on('change', browserSync.reload);
  // Мониторим папку-источник изображений и выполняем images(), если есть изменения
  watch('app/images/src/**/*', images);

}

function buildcopy() {
  return src([ // Выбираем нужные файлы
    'app/css/**/*.min.css',
    'app/js/**/*.min.js',
    'app/images/dest/**/*',
    'app/**/*.html',
  ], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
  return src('dist', { allowEmpty: true }).pipe(clean()) // Удаляем папку "dist/"
}


exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.build = series(cleandist, styles, scripts, images, buildcopy);
exports.default = parallel(styles, scripts, browsersync, startwatch);
