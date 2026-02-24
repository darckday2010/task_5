/**
 * Скрипт генерации данных для json-server:
 * - 10 000 записей проектов
 * - 250 менеджеров (отдельная коллекция для searchable-фильтра)
 * Запуск: node server/generate-data.js
 */

const fs = require('fs');
const path = require('path');

const departments = ['Разведка', 'Добыча', 'Переработка', 'Логистика', 'Сбыт'];
const statuses = ['Активный', 'Завершён', 'Приостановлен', 'Планирование'];
const priorities = ['Высокий', 'Средний', 'Низкий'];

const projectPrefixes = [
  'Модернизация', 'Оптимизация', 'Разработка', 'Внедрение', 'Автоматизация',
  'Реконструкция', 'Строительство', 'Расширение', 'Интеграция', 'Мониторинг',
  'Диагностика', 'Проектирование', 'Испытание', 'Калибровка', 'Анализ',
];

const projectSuffixes = [
  'системы учёта', 'трубопровода', 'скважины', 'насосной станции', 'терминала',
  'хранилища', 'установки', 'платформы', 'блока управления', 'линии подачи',
  'контрольного узла', 'распределительной сети', 'резервуарного парка', 'компрессорной',
  'системы безопасности', 'теплообменника', 'сепаратора', 'дренажной системы',
];

const lastNames = [
  'Иванов', 'Петров', 'Сидоров', 'Козлов', 'Морозов', 'Волков', 'Лебедев', 'Новиков',
  'Фёдоров', 'Егоров', 'Кузнецов', 'Попов', 'Соколов', 'Михайлов', 'Андреев',
  'Орлов', 'Макаров', 'Зайцев', 'Белов', 'Тихонов', 'Смирнов', 'Васильев',
  'Павлов', 'Семёнов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьёв', 'Медведев',
  'Никитин', 'Тарасов', 'Белоусов', 'Комаров', 'Пономарёв', 'Киселёв', 'Данилов',
  'Сафонов', 'Калинин', 'Чернов', 'Герасимов', 'Григорьев', 'Мельников', 'Якушев',
  'Денисов', 'Романов', 'Захаров', 'Борисов', 'Королёв', 'Ковалёв', 'Щербаков',
  'Ильин', 'Гусев', 'Титов', 'Крылов', 'Максимов', 'Осипов', 'Филиппов',
  'Маркин', 'Большаков', 'Суханов', 'Миронов', 'Алексеев', 'Степанов', 'Лазарев',
  'Рыбаков', 'Кудрявцев', 'Баранов', 'Куликов', 'Абрамов', 'Архипов', 'Панов',
  'Шилов', 'Копылов', 'Бобров', 'Жуков', 'Логинов', 'Горбунов', 'Савельев',
  'Шарапов', 'Устинов', 'Власов', 'Суворов', 'Трофимов', 'Кабанов', 'Костин',
  'Ефимов', 'Исаев', 'Коновалов', 'Быков', 'Евдокимов', 'Юдин', 'Котов',
  'Дроздов', 'Носов', 'Лукин', 'Прохоров', 'Нестеров', 'Фомин', 'Рожков',
  'Третьяков', 'Колесников', 'Овчинников', 'Селиванов', 'Кудряшов',
];

const firstInitials = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'И', 'К', 'Л', 'М',
  'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Э', 'Ю',
];

const middleInitials = [
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'И', 'К', 'Л', 'М',
  'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Э', 'Ю',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toISOString().split('T')[0];
}

function generateManagers(count) {
  const managers = [];
  const usedNames = new Set();

  while (managers.length < count) {
    const name = `${randomItem(lastNames)} ${randomItem(firstInitials)}.${randomItem(middleInitials)}.`;
    if (usedNames.has(name)) continue;
    usedNames.add(name);

    managers.push({
      id: managers.length + 1,
      name: name,
      department: randomItem(departments),
    });
  }

  return managers;
}

function generateProjects(count, managers) {
  const projects = [];

  for (let i = 1; i <= count; i++) {
    const budget = randomInt(500000, 50000000);
    const progress = randomInt(0, 100);
    const spentRatio = progress / 100 * (0.8 + Math.random() * 0.4);
    const spent = Math.round(budget * Math.min(spentRatio, 1));
    const manager = randomItem(managers);

    projects.push({
      id: i,
      projectName: `${randomItem(projectPrefixes)} ${randomItem(projectSuffixes)} №${randomInt(1, 999)}`,
      department: manager.department,
      status: randomItem(statuses),
      budget: budget,
      spent: spent,
      progress: progress,
      startDate: randomDate(2020, 2025),
      managerId: manager.id,
      manager: manager.name,
      priority: randomItem(priorities),
    });
  }

  return projects;
}

const managers = generateManagers(250);
const projects = generateProjects(10000, managers);

const data = { projects, managers };
const outputPath = path.join(__dirname, 'db.json');

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Сгенерировано: ${projects.length} проектов, ${managers.length} менеджеров → ${outputPath}`);
