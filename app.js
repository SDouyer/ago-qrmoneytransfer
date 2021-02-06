var express = require('express');
var path = require('path');
var logger = require('morgan');
var exphbs = require('express-handlebars');
const { v4: uuidv4 } = require('uuid');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine(".hbs", exphbs({
  extname: ".hbs",
  layoutsDir: "./views",
  partialsDir: "./views",
  defaultLayout: "main",
  helpers: {
    list: (items, options) => {
      let out = "";
      for(let i=0, l=items.length; i<l; i++) {
        out = out + options.fn(items[i]);
      }
      return out;
    },
    selected: (foo, bar) => {
      return foo == bar ? " selected" : " ";
    },
  }
}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const users = {
  0: {
    id: 0,
    firstname: "Alice",
    lastname: "Smith",
    balance: 1000
  },
  1: {
    id: 1,
    firstname: "Bob",
    lastname: "Cooper",
    balance: 400
  },
  2: {
    id: 2,
    firstname: "Eve",
    lastname: "West",
    balance: 900
  }
};
var newUserId = 3;

const transactions = {
  "1741f879-4349-4ee4-8834-fbfefc8a1ee5": {
    id: "1741f879-4349-4ee4-8834-fbfefc8a1ee5",
    from: 0,
    to: 1,
    amount: 150,
    validated: true,
    initiatedAt: "06/02/2021, 12:48:30",
    validatedAt: "06/02/2021, 12:54:29",
  },
  "9c313e6e-ea73-44d1-9d00-929e99e9432f": {
    id: "9c313e6e-ea73-44d1-9d00-929e99e9432f",
    from: 2,
    to: 0,
    amount: 620,
    validated: true,
    initiatedAt: "07/02/2021, 09:28:20",
    validatedAt: "07/02/2021, 13:54:56",
  },
  "2d25a779-f8f2-4643-963e-8718d1efb571": {
    id: "2d25a779-f8f2-4643-963e-8718d1efb571",
    from: 2,
    to: 1,
    amount: 43,
    validated: false,
    initiatedAt: "07/02/2021, 15:03:02",
  }
};

app.get("/", (req, res) => {
  res.render("welcome.hbs", {
    layout: "main",
  });
});

app.get("/users", (req, res) => {
  res.render("users.hbs", {
    layout: "main",
    title: "Utilisateurs",
    users: users
  });
});
app.get("/users/create", (req, res) => {
  res.render("user-create.hbs", {
    layout: "main",
    title: "Créer un nouvel Utilisateur"
  });
});
app.post("/users/create", (req, res) => {
  // const { firstname, lastname, balance } = req.body;
  const { firstname, lastname } = req.body;
  users[newUserId] = {
    id: newUserId,
    firstname: firstname,
    lastname: lastname,
    balance: 0
    // balance: balance
  };
  newUserId = newUserId + 1;
  res.redirect("/users");
});

app.get("/transactions", (req, res) => {
  const transactionTable = Object.assign({}, transactions);
  Object.keys(transactionTable).forEach((key) => {
    const sender = users[transactions[key].from];
    const receiver = users[transactions[key].to];
    transactionTable[key].sender = sender.firstname + " " + sender.lastname;
    transactionTable[key].receiver = receiver.firstname + " " + receiver.lastname;
  });

  res.render("transactions.hbs", {
    layout: "main",
    title: "Transactions",
    transactions: transactionTable
  });
});

app.get("/transactions/create", (req, res) => {
  res.render("transaction-create.hbs", {
    layout: "main",
    title: "Créer une nouvelle Transaction",
    users: users
  });
});

function checkTransaction(from, amount, to) {
  if (users[from] == undefined) {
    return { valid: false, error: "Emetteur inconnu"};
  }
  if (users[to] == undefined) {
    return { valid: false, error: "Bénéficiaire inconnu"};
  }
  if (from === to) {
    return { valid: false, error: "Bénéficiaire doit être différent d'Emetteur"};
  }
  if (users[from].balance < amount) {
    return { valid: false, error: "Solde insuffisant de l'émetteur"};
  }
  return {valid: true};
}

app.post("/transactions/create", (req, res) => {
  const { from, amount, to } = req.body;
  const check = checkTransaction(from, parseInt(amount), to);
  if (check.valid) {
    const initiatedAt = new Date().toLocaleString();
    const transactionId = uuidv4();

    transactions[transactionId] = {
      id: transactionId,
      from: from,
      to: to,
      amount: parseInt(amount),
      validated: false,
      initiatedAt: initiatedAt
    };

    res.redirect("/transactions");
  } else {
    res.render("transaction-create.hbs", {
      layout: "main",
      title: "Créer une nouvelle Transaction",
      users: users,
      alert: check.error
    });
  }

});

app.get("/transactions/qrcode/:id", (req, res) => {
  res.render("transaction-qrcode.hbs", {
    layout: "main",
    title: "Transaction - validation",
    validationLink: "http://" + req.headers.host + "/transactions/validate/" + req.params.id
  });
});

function checkTransactionValidation(transactionId) {
  if (transactions[transactionId] == undefined) {
    return { valid: false, error: "La transaction est inconnue"};
  }
  if (transactions[transactionId].validated) {
    return { valid: false, error: "La transaction a déjà été validée"};
  }
  const transaction = transactions[transactionId];
  if (users[transaction.from].balance < transaction.amount) {
    return { valid: false, error: "Fonds de l'émetteur insuffisants pour dénouer la transaction"};
  }
  return {valid: true};
}

app.get("/transactions/validate/:id", (req, res) => {
  const transactionId = req.params.id;
  const check = checkTransactionValidation(transactionId);
  if (check.valid) {
    const transaction = transactions[transactionId];
    users[transaction.from].balance = users[transaction.from].balance - transaction.amount;
    users[transaction.to].balance = users[transaction.to].balance + transaction.amount;
    transactions[transactionId].validated = true;
    transactions[transactionId].validatedAt = new Date().toLocaleString();

    res.render("transaction-validate.hbs", {
      layout: "main",
      title: "Transaction validée",
    });
  } else {
    res.render("transaction-validate.hbs", {
      layout: "main",
      title: "Erreur de Validation",
      alert: check.error
    });
  }
});


module.exports = app;
