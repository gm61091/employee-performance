const express = require(`express`);
const pgp = require(`pg-promise`)();
const db = pgp(`postgres://qonnxkqn:yAamuth4AZ0bhZEGuoBLeR6tfHO-wXYC@raja.db.elephantsql.com/qonnxkqn`);
const PORT = 3000;

const app = express();
app.use(express.json());

app.get(`/employees`, async (req, res) => {
   const employeeList = await db.many('SELECT * FROM employees')
   res.json(employeeList)
});

// Update the salary of all employees with a performance_rating of 5 by increasing it by 7%.

app.put('/employees/updateSalary', async (req, res) => {
    await db.none('UPDATE employees SET salary = salary * 1.07 WHERE performance_rating = $1', [5])
    res.send('Salary updated')
});

// Delete the employee with the lowest performance_rating.

app.delete(`/employees/deleteLowest`, async (req, res) => {
    await db.none('DELETE FROM employees WHERE id = (SELECT id FROM employees ORDER BY performance_rating ASC LIMIT 1)')
    res.send('Lowest-rated employee deleted')
});

// Show all employees in the Sales department.

app.get(`/employees/sales`, async (req, res) => {
   const salesEmployees = await db.many('SELECT * FROM employees WHERE department = \'Sales\'')
    res.json(salesEmployees)
});

// Show the highest performance_rating in the IT department.

app.get(`/employees/highestInIt`, async (req, res) => {
   const highestInIt = await db.one(`SELECT MAX(performance_rating) FROM employees WHERE department = 'IT'`)
    res.send(`Highest performance rating in the IT department: ${highestInIt}`)
});

// Update the table so that all employees hired after 2015 have their performance_rating increased by 1.

app.put(`/employees/updatePerformanceAfter2015`, async (req, res) => {
    await db.none(`UPDATE employees SET performance_rating = performance_rating + 1 WHERE hire_date > '2015-01-01'`)
    res.send('Updated performance ratings after 2015')
});

// Show the names and salaries of employees with a performance_rating greater than 4.

app.get(`/employees/highPerformers`, async (req, res) => {
   const highPerformers = await db.any('SELECT name, salary FROM employees WHERE performance_rating > 4')
   res.json(highPerformers)
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`);
});
