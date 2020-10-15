const eventsList = require('./events.json');

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const events = await loadEvents();
    res.send(events);
});

router.post('/', async (req, res) => {
    // POST query
});

async function loadEvents() {
    let parsedEvents = eventsList.map(event => {
        return (event.success ? {...event} : {...event, name: '#no_face', login: '#no_face'})
    })
    return parsedEvents
}

module.exports = router;