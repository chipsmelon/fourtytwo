const { Client, Intents, MessageEmbed, MessageButton, MessageActionRow} = require('discord.js'); // I need discord.js so I can avoid networking -- present e ! says very true
const fs = require('fs/promises'); // fs promises is superior
const gameSessions = {}; // this object contains all active game sessions -- present e ! says use a map they're cooler (I do think the variable used to be named gameMap or something but I changed it because I wanted to pretend that maps didn't exist)
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS] }); // slash commands are too annoying to code btw -- present e ! says shut up and use slash commands
/* 
I added way too many comments to this code past me is evil
also why did I hate the idea of using multiple files
I was truly a bit more stupid
character growth
*/
class Game { // a class so I can make a bunch of active game sessions -- present e ! says ok why not
    constructor(message, id) {
        if (!message) return this.isBad = true; // stop the wacky stuff -- present e ! could use some elaboration on what "wacky stuff" is
        this.id = id; // a user id for the user the game is for -- present e ! says the code is already self explanatory for this line and you should just shut up
        this.message = message; // allows me to easily edit the game message -- present e ! says you shouldn't be commenting on these lines because everyone knows how assignment works
        this.guesses = 0; // create the guesses count -- present e ! says everybody knows this is a guesses count already
        this.embed = this.message.embeds[0]; // game need it's own embed object so it doesn't break when the embed is deleted -- present e ! says its*
    };
    async lose() { // basically a game over method -- present e ! says documenting what a method does is fine, commenting on every line of the method is not fine
        const quotes = await fs.readFile('./quotes.json', 'utf8').then(JSON.parse); // load all the quotes from a file -- present e ! says we can tell what this line does already
        const name = await rname(); // get an epic name -- present e ! says stop commenting on every line
        const color = (this.pissMode) ? '#a0a517' : 'RED'; // set piss mode color if piss mode -- present e ! says most programmers aren't dumb enough to not get what this line does please stop commenting
        const embed = this.embed.setColor(color).setFooter({text: quotes.loseGame[Math.floor(Math.random() * quotes.loseGame.length)].replace('{name}', name)}).setTitle('You lose:tm:');
        edit({embeds: [embed]}, this.message).catch('die'); // edit the game message to change it to a losing message with a random loseGame quote footer -- present e ! says this comment is just as helpful as reading the original line of code
        write(this.id, 'losses'); // write a loss to the player's stats -- present e ! is going to copy paste from the previous line: "this comment is just as helpful as reading the original line of code"
        delete gameSessions[this.id]; // self deletus -- present e ! says please be quiet
    };
    async win() { // the win method -- present e ! says no way
        const quotes = await fs.readFile('./quotes.json', 'utf8').then(JSON.parse); // load all the quotes from a file -- present e ! says we've seen this line and comment before
        const color = (this.pissMode) ? '#d0fc1e' : 'GREEN'; // set piss mode color if piss mode -- present e ! says we've seen this line and comment before, and this present e ! message
        const embed = this.embed.setTitle('You win:tm:').setColor(color).setFooter({text: quotes.winGame[Math.floor(Math.random() * quotes.winGame.length)]});
        edit({embeds: [embed]}, this.message).catch('die'); // edit the game message to change it to a win message -- present e ! says that's crazy this just looks like the lose function with slightly different code
        write(this.id, 'wins'); // write a win to the player's stats -- present e ! says you should've put win and lose in the same function because that's like a pretty cool idea, and they have like the same code
    };
    async move(w, w2) { // a method to display moves -- present e ! says no, this does not just display moves, it handles the move and decides whether or not a win or loss happens as well
        const w3 = (this.biggieMode) ? w.replaceAll('W', '⬛').replaceAll('Y', '🟨').replaceAll('G', '🟩') : w; // present e ! wonders how you can be so addicted to writing comments yet so not addicted to making descriptive variable names
        this.guesses++; // add +1 guess -- present e ! says ...
        if (this.unroll) {
            this.unroll = (typeof this.unroll == 'object') ? this.unroll : ['```', '.....', '```'];
            this.unroll[this.unroll.length - 2] = `${w3} (${w2})`;
            this.unroll[this.unroll.length - 1] = '.....';
            this.unroll.push('```');
            const embed = this.embed.setDescription(this.unroll.join('\n'));
            this.embed = embed; // present e ! says WHERE DID THE COMMENTS GO EH???? CAN YOU NOT DESCRIBE THIS CODE???? and the answer is yes I remember the unroll mode code being added quickly and without much thought
        } else {
            let g = this.embed.description.split('\n'); // create an array of each line of text in the embed description -- present e ! says thanks for the obvious comment, your variable names still suck
            g[this.guesses] = `${w3} (${w2})`; // set the line for the current guess to the word guessed -- present e ! says man I really hate these variable names
            const embed = this.embed.setDescription(g.join('\n')); // edit the current embed to have the new text
            this.embed = embed;
        };
        edit({embeds: [this.embed]}, this.message).then(m => {this.message = m;}).catch('die');
        if (w == 'GGGGG') {
            await this.win();
            const player = await fs.readFile(`./playerStats/${this.id}.json`).then(JSON.parse).catch(e => {e;return {};});
            send("You beat Word Game:tm:! Great job, that's pretty neat.", this.message).catch('die');
            if (player.streak && player.streak == 4 && !player.real) {
                send("Oh also uh, there's this powerful entity that decided to send a message to you. Here's the message:\n\n*I have taken interest in your vocabularic skill.*\n*You'll be receiving another message from me once you reach 10.*\n\nReally short message but it's still crazy how something this powerful even cared lmao (you have a weak streak).", this.message).catch('die');
            };
            if (player.streak && player.streak >= 9 && !player.real) {
                send("Oh also uh, you just got a message. Here it is:\n\n*You are far better than e ! at this game.*\n*This is a test to see if you actually have vocabularic skill.*\n*If you care about your streak then don't even try, and know you will never impress me.*\n*I'll keep sending this message until you challenge me.*\n\nYou can be a nerd and not do it, but why? I did it and won and look at me now! It's time to use `..endgame`.", this.message).catch('die');
                write(this.id, 'real');
            }; // present e ! says the entire endgame code was rushed so that's why none of it has comments
            return delete gameSessions[this.id];
        };
        if (this.guesses == 6) {gameSessions[this.id].lose();return send(`Loser. The word was ${this.answer} {name}.`, this.message).catch('die');}; // present e ! says being on one line doesn't make you better, also you should've put the lose message in the lose function why didn't you do that
        if (this.guesses == 5) send(`Wow {name} you are really word gaming right now.`, this.message).catch('die'); // present e ! says this response made me laugh - yes this is a useless comment shut up
    };
};
class EndGame { // present e ! says all endgame related code was very rushed so this isn't gonna look pretty
    constructor(m, id) {
        this.eg = true; // present e ! says use instanceof
        this.id = id;
        this.message = m;
        this.guesses = 0;
        this.phase = 0;
        this.embed = this.message.embeds[0];
    };
    async mo(w, w2) { // present e ! says oh look now the method names describe nothing too
        if (this.waiting) return;
        this.guesses++;
        let g = this.embed.description.split('\n');
        switch (this.phase) {
            case 0:
                g[this.guesses] = `${w} (${w2})`;
                this.embed = this.embed.setDescription(g.join('\n'));
                if (w == 'GGGGG') {
                    send("You won. Is that really it?", this.message).catch('die');
                    this.waiting = true;
                    this.notOverLol();
                };
                if (this.guesses == 4 && !this.waiting) {
                    send('Well that was anticlimactic.', this.message).catch('die');
                    write(this.id, 'losses');
                    delete gameSessions[this.id];
                };
                break;
            case 1:
                let w3 = w.split(''); // present e ! says why are you obsessed with naming your variables w that's honestly an L
                w3[Math.floor(Math.random() * 5)] = '?';
                w3 = w3.join('');
                g[this.guesses] = `${w3} (${w2})`;
                this.embed = this.embed.setDescription(g.join('\n'));
                if (this.guesses == 1) send("You just got a message:\n\n*OOPS!!! LOOKS LIKE I FORGOT TO GIVE YOU SOME OF THE HINT!!!!*\n*(Inspired by Hedgehog_Gimli)*\n\nIs that cheating?", this.message).catch('die');
                if (w == 'GGGGG') {
                    this.waiting = true;
                    send("Yet another message:\n\n*NO NO NO NO!!!!*\n*YOU WERENT SUPPOSED TO WIN!!!!!*\n*I'LL USE EXTRA COMPLEX WORDS!!!*\n*LETS GO BACKWARDS TOO!!*\n\nAnd they refuse to even send a new embed. Guess you're scrolling back up!", this.message).catch('die');
                    this.guesses = 0;
                    const words = await fs.readFile('./words.json').then(JSON.parse);
                    this.answer = words.words[Math.floor(Math.random() * words.words.length)];
                    this.phase++;
                    return this.waiting = false;
                };
                if (this.guesses == 5 && !this.waiting) {
                    send('Aaaaaaand you failed!', this.message).catch('die');
                    write(this.id, 'losses');
                    delete gameSessions[this.id];
                };
                break;
            case 2:
                g[g.length - (1 + this.guesses)] = `${w} (${w2})`;
                this.embed = this.embed.setDescription(g.join('\n'));
                if (w == 'GGGGG') {
                    send("Another message:\n\n*FINE!! YOU WIN!!!*\n*GO OUTSIDE OR SOMETHING!!*\n*JUST GET SOMEWHERE FAR AWAY FROM ME!!!!!*\n*TAKE YOUR 100% COMPLETION!!!*\n\nLooks like it's all over now.", this.message).catch('die');
                    write(this.id, 'realReal');
                    this.embed = this.embed.setColor('GREEN').setFooter('oh wow 100% so cool you beat word game').setTitle('I Hate You:tm:');
                    return edit({embeds: [this.embed]}, this.message).catch('die');
                }
                if (this.guesses == 5) {
                    send("Looks like you just lost!", this.message).catch('die');
                    write(this.id, 'losses');
                    delete gameSessions[this.id];
                };
        };
        edit({embeds: [this.embed]}, this.message).then(me => {this.message = me;}).catch('die');
    };
    async notOverLol() {
        setTimeout(async () => {
            send('You just got a message:\n\n*I fucked your mom {name}.*\n\nOh.', this.message).catch('die');
            const words = await fs.readFile('./words.json').then(JSON.parse);
            this.answer = words.answers[Math.floor(Math.random() * words.answers.length)];
            this.guesses = 0;
            this.embed = this.embed.setTitle('Not Over:tm:').setFooter({text: 'Here we go again.'}).setColor('DARK_RED').setDescription('```\n?????\n?????\n?????\n?????\n?????\n```');
            const me = await send({embeds: [this.embed]}, this.message).catch('die');
            this.message = me;
            this.phase++;
            this.waiting = false;
        }, 6000);
    };
}; // present e ! says I really didn't want to review most of that code

client.on('messageCreate', async function handleMessage(m) {
    if (gameSessions[m.author.id]) {
        switch (m.content) {
            case 'm':
                return send('stfu stop just saying m (another one inspired by shadqw)', m).catch('die');
            case 'ratio':
                if (gameSessions[m.author.id].ratio) return send('Sorry {name} but I have already ratioed you.', m);
                const me = await send('ratio {name}', m).catch('die'); // present e ! says I'm still guilty of naming temporary message variables 'me' I'm sorry I'll try to stop
                if (me) me.react('👍').catch('die');
                m.react('👎').catch('die');
                return gameSessions[m.author.id].ratio = true;
        };
    };
    if (m.author.bot || !m.content.startsWith('..')) return; // bots are ignored - messages that don't start with the prefix are also ignored -- present e ! says thanks I totally don't learn what this line does from every discord.js tutorial I read
    let args = m.content.slice(2).replace(/  +/g, ' '); // basically turn the message into a bunch of easily usable arguments -- present e ! says k
    if (args.startsWith('eval')) {if (m.author.id == '815350320959193128') {eval(args.replace('eval', ''))};};
    args = args.toLowerCase().split(' ');
    // check if there's a valid command name and run the corresponding command function -- present e ! says this is what happens when you refuse to program multi-file command handling
    switch (args[0]) {
        case 'play':
        case 'pl':
            play(m, args).catch(e => {console.log(e);send(`${e}\n**That's a gamer moment**`, m).catch(console.log)});
            break;
        case 'guess':
        case 'move':
        case 'mo':
            guessWord(args, m).catch(e => {console.log(e);send(`${e}\n**That's a gamer moment**`, m).catch(console.log)});
            break;
        case 'wordcolor':
        case 'wcl':
        case 'fakeguess':
            const colors = await colorWord(args[1], args[2]).catch(e => {console.log(e);send(`${e}\n**That's a gamer moment**`, m).catch(console.log)});
            send(String(colors), m).catch(console.log);
            break;
        case 'stats':
        case 'score':
            stats(m, args).catch(e => {console.log(e);send(`${e}\n**That's a gamer moment**`, m).catch(console.log)});
            break;
        case 'endgame': // present e ! says guys look another rushed endgame code moment
            const playe = await fs.readFile(`./playerStats/${m.author.id}.json`).then(JSON.parse).catch(e => {e;return {};}); // present e ! says you were so close to having an actual useful variable name
            if (!playe.real || gameSessions[m.author.id]) return;
            if (playe.realReal) return send("*No, I don't wanna play with you anymore.*", m).catch(console.log);
            let me = await send("Looks like you're gonna challenge the powerful entity thing. Holup lemme just set up the game rq. Also use `..egmo` instead of normal mo btw.", m).catch('die');
            if (!me) return;
            me.channel.sendTyping().catch('die');
            setTimeout(async function weBeginTheEnd() {
                const embed = new MessageEmbed().setTitle('Real Mode:tm:').setFooter({text: 'Things are getting real now.'}).setDescription('```\n.....\n.....\n.....\n.....\n```');
                me = await send({embeds: [embed]}, m).catch('die');
                if (!me) return;
                const words = await fs.readFile('./words.json').then(JSON.parse);
                gameSessions[m.author.id] = new EndGame(me, m.author.id);
                gameSessions[m.author.id].answer = words.answers[Math.floor(Math.random() * words.answers.length)];
            }, 6000);
            break;
        case 'egmo':
            if (!gameSessions[m.author.id] || !gameSessions[m.author.id]?.eg) return; // present e ! says I suppose .eg is shorter than just using instanceof but instanceof is more readable in my opinion so yeah also use maps
            const words = await fs.readFile('./words.json').then(JSON.parse);
            if (!args[1] || args[1].length > 5 || args[1].length < 5 || (!words.answers.includes(args[1]) && !words.words.includes(args[1])) || !gameSessions[m.author.id].answer) return send("We both know at this point that that's not a valid guess.", m);
            const wordc = await colorWord(args[1], gameSessions[m.author.id].answer);
            gameSessions[m.author.id].mo(wordc, args[1])
    }; // present e ! says I really should've put gameSessions[m.author.id] in a 'game' variable
});

client.on('interactionCreate', async function itMustBeAbutton(i) {
    if (i.isCommand()) {i.reply('Those times are over my friend.'); return;}; // present e ! says this bot used to use slash commanda and this is a reference to that
    if (!i.isButton()) return;
    const name = await rname(); // get a random epic insult name
    if (i.customId !== i.user.id) {i.reply({content: `Nice try ${name}.`, ephemeral: true}).catch('die'); return;}; // stop people from pressing other people's quit buttons
    if (!gameSessions[i.user.id]) {i.update({content: 'lol!', components: []}).catch('die');return;};
    i.update({content:'Quitters never win or something so you get a loss.', components: []}).catch('die'); // update the quit message
    clearTimeout(gameSessions[i.user.id].timer);
    gameSessions[i.user.id].lose(); // make them lose the game -- present e ! says no way I would've never known what .lose() does
    delete gameSessions[i.user.id]; // terminate the game session
});

client.once('ready', async function theReady(client) {
    console.log(`Logged into ${client.user.tag} (${client.user.id})`);
    client.user.setActivity(`Word Game™`, {type: 'PLAYING'});
});

async function play(m, args) {
    if (gameSessions[m.author.id]) { // this area stops active players from starting multiple games at once - and gives them a quit option -- present e ! says ok very cool why did you write more comments in the area
        const row = new MessageActionRow().addComponents(new MessageButton().setCustomId(`${m.author.id}`).setLabel('Yes.').setStyle('SUCCESS')); // create a button with the user's id as a custom id
        send({content: "Oi you're playing a round rn, wanna quit (and gain a loss for it)?", components: [row]}, m).then(me => {
            gameSessions[m.author.id].timer = setTimeout(() => {
                edit({content: "Guess you wanna not quit (goodbye button)!", components: []}, me).catch('die'); // editing messages amiright
            }, 10000);
        }).catch('die');
        return;
    };
    const pissMode = args.includes('piss');
    const biggieMode = args.includes('biggie');
    const unroll = args.includes('unroll');
    const color = (pissMode) ? 'YELLOW' : 'GREEN';
    const desc = (unroll) ? '```\n.....\n```' : '```\n.....\n.....\n.....\n.....\n.....\n.....\n```';
    const quotes = await fs.readFile('./quotes.json', 'utf8').then(JSON.parse); // read the quotes file to get a quote to use in the footer
    const embed = new MessageEmbed().setTitle('Some Word Game:tm:').setColor(color).setFooter({text: quotes.mainGame[Math.floor(Math.random() * quotes.mainGame.length)]}).setDescription(desc);
    await send({embeds: [embed]}, m).then(async (game) => {
        gameSessions[m.author.id] = new Game(game, m.author.id); // create a new game and add it to gameSessions
        if (gameSessions[m.author.id].isBad) return delete gameSessions[m.author.id];
        let words = await fs.readFile('./words.json', 'utf8').then(JSON.parse); // load every valid word
        gameSessions[m.author.id].answer = words.answers[Math.floor(Math.random() * words.answers.length)]; // give the game an answer
        gameSessions[m.author.id].pissMode = pissMode;
        gameSessions[m.author.id].biggieMode = biggieMode;
        gameSessions[m.author.id].unroll = unroll;
    }).catch('die');
};

async function guessWord(args, m) { // present e ! says all these if statements...
    if (!gameSessions[m.author.id]) return send("You can't guess right now because I don't wanna, {name}.", m).catch('die'); // make sure this function doesn't run while they're not playing a game
    if (gameSessions[m.author.id].eg) return;
    if (!args[1] && gameSessions[m.author.id].sayAgain) return send("No I didn't mean that literally.", m).catch('die'); // for the very intellectual people
    if (!args[1]) {send("Can you say that again?", m).catch('die');gameSessions[m.author.id].sayAgain = true;return;}; // there must be an args[1] to continue -- present e ! says this line is not very nice
    if (gameSessions[m.author.id].sayAgain) delete gameSessions[m.author.id].sayAgain;
    switch (args[1]) {
        case 'shadqw':
            return send("Sorry I'll stop using only shadqw quotes (not favouritism) (inspired by hedgehog_gimli)", m).catch('die');
        case 'm':
            return send('stfu stop just saying m (another one inspired by shadqw)', m).catch('die');
        case 'ratio':
            if (gameSessions[m.author.id].ratio) { // present e ! says this doesn't use the typical js user return instead of else because I wanted people to be able to guess ratio multiple times
                send('Sorry {name} but I have already ratioed you.', m);
            } else {
                const me = await send('ratio {name}', m).catch('die');
                if (me) me.react('👍').catch('die');
                m.react('👎').catch('die');
                gameSessions[m.author.id].ratio = true;
            };
    };
    if (args[1].length > 5) {send("There's too much!", m).catch('die');return;}; // make sure the word is not too long
    if (args[1].length < 5 && (m.author.id == '804092006627934229')) return send("That word is shorter than you {name}.", m).catch('die'); // a special response for dwarves
    if (args[1].length < 5) return send("{name}?", m).catch('die'); // make sure the word isn't too short
    const words = await fs.readFile('./words.json', 'utf8').then(JSON.parse); // load every valid word
    if (!words.words.includes(args[1]) && !words.answers.includes(args[1])) return send(`Try ${args[1]}ing some bitches. (this message was inspired by shadqw)`, m).catch('die'); // make sure the word is real
    if (!gameSessions[m.author.id].answer) return send("The answer hasn't even loaded yet. Stop speedrunning so hard {name}.", m).catch('die'); // possible error so it must have a response
    const wordc = await colorWord(args[1], gameSessions[m.author.id].answer); // apply the proper word coloring to the word
    gameSessions[m.author.id].move(wordc, args[1]);
};
async function colorWord(w, a) {
    const word = w.split(''); // split the guessed word into an array
    const answer = a.split(''); // split the answer into an array to compare
    let wordc;
    let ymap = {}; // this is an object to help with accurate yellow letters
    answer.forEach(x => {ymap[x] = ymap[x] || 0;ymap[x]++;});
    wordc = word.map((x, i) => {return (x == answer[i]) ? 'G' : 'W'}); // properly convert the word into G and W
    wordc.forEach((x, i) => {if (x == 'G') {ymap[word[i]]--};}); // go through the list of G and W and remove ymap letters for every G
    wordc = word.map((x, i) => {  // if the letter is in the answer and ymap for it isn't 0 AND the spot isn't G then apply Y and remove 1 from the letter's ymap
        if (answer.includes(x) && ymap[x] > 0 && wordc[i] != 'G') {
            ymap[x]--;
            return 'Y';
        };
        return wordc[i];
    });
    return wordc.join('');
};

async function write(id, p) {
    let player = await fs.readFile(`./playerStats/${id}.json`, 'utf8').then(JSON.parse).catch(e => {return (e.code == 'ENOENT') ? {} : `err\n${e}`}); // read the proper player stats file and return an empty object if it doesn't exist
    if (typeof player == 'string') {
        console.log(`problem reading file (${id})\n${player}`); // if there's an error reading the file then just stop and log it
        return;
    };
    if (p == 'real') {
        player.real = !player.real;
    } else if (p == 'realReal') {
        player.realReal = !player.realReal;
    }else {
        player.streak = player.streak || 0; // if the player.streak value is missing then it's 0 now
        player.streak = (p == 'wins' || p == 'steals') ? player.streak + 1 : 0; // if the player's getting a loss the streak is now 0, otherwise it gets bumped up by 1
        player[p] = player[p] || 0;
        player[p]++;
    };
    fs.writeFile(`./playerStats/${id}.json`, JSON.stringify(player), 'utf8');
};

async function rname() { // present e ! says honestly this is the best function I rate it 10/10
    const names = await fs.readFile('./quotes.json').then(JSON.parse);
    let name = names.names[Math.floor(Math.random() * names.names.length)];
    if (Math.floor(Math.random() * 20) < 1) {name = 'you bloody ' + name;};
    if (Math.floor(Math.random() * 20) < 1) {name = 'you absolute ' + name.replace('you ', '');};
    return name;
};

async function stats(m, args) {
    const id = args[1] ? args[1].match(/^<@!?(\d+)>$/) && args[1].match(/^<@!?(\d+)>$/)[1] : m.author.id; // parse the user mention for args 1 (if there is one), otherwise just return the command user's id
    if (!id) return send(`I'm not sure if I know who that is.`); // make sure it's a user mention
    console.log(id);
    const player = await fs.readFile(`./playerStats/${id}.json`, 'utf8').then(JSON.parse).catch(e => {return {};}); // read the proper player stats file and return an empty object if it doesn't exist
    const user = client.users.cache.get(id) ?? client.user;
    const quotes = await fs.readFile('./quotes.json', 'utf8').then(JSON.parse); // load all the quotes from a file
    const embed = new MessageEmbed().setColor('BLUE').setTitle(user.tag).setFooter({text: quotes.viewProf[Math.floor(Math.random() * quotes.viewProf.length)]}).setDescription(`**Current Streak**: ${player.streak || 0}\n**Wins**: ${player.wins || 0}\n**Losses**: ${player.losses || 0}\n**${(player.realReal) ? 'Vocabularic': '???'}**: ${player.realReal || '???'}`).setThumbnail(user.avatarURL());
    send({embeds: [embed]}, m).catch('die');
};

async function send(t, m) {
    if (!m) return;
    const name = (typeof t == 'string') ? await rname() : false; // do we have to generate a name????
    if (name) {t = t.replace('{name}', name);}; // if we do then do the replace!!!
    m = await m.channel.send(t).then(m => {return m;}).catch(e => {'die';}); // channel.send but it handles error a bit
    return m; // my comments are useless here -- present e ! says you were so close to realizing that you should comment less
};

async function edit(t, m) {
    if (!m) return;
    return m.channel.messages.fetch(m.id).then(m => {return m.edit(t);}).catch(e => {return send(t, m);}); // fetch the message to make sure it exists - if it doesn't exist then just send a new message with le epic send function
};

fs.readFile('./token.txt', 'utf8').then((t) => {client.login(t);}); // a very efficient method of logging into the bot -- present e ! says why the hgfdd did I use a txt file to store the token