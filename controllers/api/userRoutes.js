const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  console.log('creating new user');
  console.log(req.body)
  try {
    const userData = await User.create({
      username: req.body.name,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.userName = userData.username;
      req.session.loggedIn = true;

      res.json(userData);
    });
    // userData.save()
  } catch (err) {
    console.log(err);
    res.status(500).json(err);

  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      res
        .status(400)
        .json({ message: 'no user account found' });
      return;
    }
    console.log(user)
    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'no user account found' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.json({ user, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(message, 'no user account found');
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
