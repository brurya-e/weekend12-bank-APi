const fs = require('fs');

const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync('./db/users.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const addUser = (body) => {
  const users = loadUsers();
  users.find((user) => {
    if (user.id === body.id) {
      throw Error('The user is allready exist');
    }
  });

  const newUser = { id: body.id, cash: body.cash || 0, credit: body.credit || 0 };

  users.push(newUser);
  saveUsers(users);
  return stringToJson('new-client', newUser);
};


const getUser = (id) => {
  const users = loadUsers();
  const index = getUserIndex(id);
  if (index === -1) {
    throw Error('user not found');
  }
  return stringToJson('client data', users[index]);
};



const getUserIndex = (userId) => {
  const users = loadUsers();
  const index = users.findIndex((user) => {
    if (user.id === userId) {
      return true;
    }
    else {
      return false;
    }
  })
  return index;
};

const deleteUser = (userId) => {
  const users = loadUsers();
  const updatedUsers = users.filter((user) => {
    if (userId !== user.id) {
      return true;
    }
    else false;
  })
  if (updatedUsers.length === users.length) {
    throw Error('User not found');
  }
  saveUsers(updatedUsers);
  return stringToJson('delete-user', userId);

};

const depositCash = (userId, cashAmount) => {
  const users = loadUsers();
  const index = getUserIndex(userId);
  if (index === -1) {
    throw Error('User not found');
  }
  users[index].cash += cashAmount;
  saveUsers(users);
  return stringToJson('deposit Cash - user', users[index]);
};

const withdrawCash = (userId, cashAmount) => {
  const users = loadUsers();
  const index = getUserIndex(userId);
  if (index === -1) {
    throw Error('User not found');
  }
  users[index].cash -= cashAmount;
  saveUsers(users);
  return stringToJson('withdraw Cash - user', users[index]);

}

const transferCash = (userId, cashAmount, targetId) => {
  const users = loadUsers();
  const index = getUserIndex(userId);
  if (index === -1) {
    throw Error('Transferring user not found');
  }

  const targetIndex = getUserIndex(targetId);
  if (targetIndex === -1) {
    throw Error('Target user not found');
  }

  if (users[index].cash + users[index].credit < cashAmount) {
    throw Error('User Does not have enough credit to make the transfer');
  }

  users[targetIndex].cash += cashAmount;
  users[index].cash -= cashAmount;
  saveUsers(users);
  return stringToJson('Transferring user', users[index], 'Target user', users[targetIndex]);
}


const stringToJson = (message, string, message2, string2) => {
  return JSON.stringify({ [message]: string, [message2]: string2 });
};

const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync('./db/users.json', dataJSON);
};


module.exports = {
  loadUsers,
  addUser,
  getUser,
  deleteUser,
  depositCash,
  withdrawCash,
  transferCash
};
