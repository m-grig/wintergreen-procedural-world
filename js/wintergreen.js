function random_item(items) {
	return items[Math.floor(Math.random()*items.length)];
}
function random_dict(items) {
	return items[Object.keys(items)[Math.floor(Math.random*Object.keys(items).length)]];
}

function init(choice) {
	//eventually uncomment to let you choose your own personality
	/*
	var text = '<h1>Choose Your First Function:</h1><div id="" style="display:flexbox;">'
	for (var key in functions) {
		text += `<button onclick="fFunc('${key}')">${key}</button>`;
	}
	text += '<h2>Or be yourself</h2></div><div id="stackBox"><label>Stack:</label><p></p></div>';
	document.getElementById('main').innerHTML = text;
	*/
	document.getElementById('main').innerHTML = '';
	player = new Character();
	var text = 'You are: <br>'+player.name+'<br>And this is a little about you:<br>'+player.stack.toString()+'<br>'+player.animals.toString();

	characterList.push(new Character());
	document.getElementById('main').innerHTML = text+'<br><hr><br>And this is your friend:<br>'+characterList[0].name+'<br>'+characterList[0].stack.toString()+'<br>'+player.animals.toString();
}

function fFunc(fName) {
	player.stack[0] = fName;
	player.stack[3] = functions[fName].opposite;
	var text = '<h1>Choose Your Second Function:</h1><div id="" style="display:flexbox;">'
	for (var key in functions) {
		if (functions[key].role != functions[player.stack[0]].role) {
			text += `<button onclick="sFunc('${key}')">${key}</button>`;
		}
	}
	text += '<div id="stackBox"><label>Stack:</label></div>';
	document.getElementById('main').innerHTML = text;
	document.getElementById('stackBox').innerHTML = `<label>Stack:</label><p>${player.stack[0]}<br>-<br>-<br>${player.stack[3]}</p>`;
}
function sFunc(fName) {
	player.stack[1] = fName;
	player.stack[2] = functions[fName].opposite;
	document.getElementById('main').innerHTML = '<div id="stackBox"><label>Stack:</label></div>';
	document.getElementById('stackBox').innerHTML = `<label>Stack:</label><p>${player.stack[0]}<br>${player.stack[1]}<br>${player.stack[2]}<br>${player.stack[3]}</p>`;
}

class Character {
	constructor(seed) {
		/*
		if (seed) {
			this.stack = seed;
			this.name = seed.name;
		}
		*/

		this.name = random_item(names);

		var deciders = [['Fi','Te'],['Ti','Fe']];
		var observers = [['Si','Ne'],['Ni','Se']];
		var animals = [['Sleep','Play'],['Consume','Blast']];
		//we might not want to use this. instead, maybe just reassign value
		deciders = deciders[Math.round(Math.random())];
		observers = observers[Math.round(Math.random())];

		this.stack = ['','','','']; // decide if stack vs animals is better. List of strings or objects?
		this.animals = ['','','',''];

		var seed = Math.random();
		if (seed >= 0.5) { //decider first
			this.stack[0] = deciders[Math.round(seed * 0.67)];
			this.stack[3] = deciders[1-Math.round(seed * 0.67)];
			seed = Math.random();
			this.stack[1] = observers[Math.round(seed)];
			this.stack[2] = observers[1-Math.round(seed)];
		} else { //observer first
			this.stack[0] = observers[Math.round(seed * 0.67)];
			this.stack[3] = observers[1-Math.round(seed * 0.67)];
			seed = Math.random();
			this.stack[1] = deciders[Math.round(seed)];
			this.stack[2] = deciders[1-Math.round(seed)];
		}

		seed = Math.random();
		var anim = {'OeDe':'play','OiDi':'sleep','OiDe':'blast','OeDi':'consume'};
		if (functions[this.stack[0]].role == 'observer') { //double decider animals
			this.animals[0] = anim[functions[this.stack[0]].alignment+functions[this.stack[1]].alignment];
			this.animals[3] = anim[functions[this.stack[3]].alignment+functions[this.stack[2]].alignment];
			if (seed >= .6) {
				this.animals[1] = anim[functions[this.stack[0]].alignment+functions[this.stack[2]].alignment];
				this.animals[2] = anim[functions[this.stack[3]].alignment+functions[this.stack[1]].alignment];
			} else {
				this.animals[1] = anim[functions[this.stack[3]].alignment+functions[this.stack[1]].alignment];
				this.animals[2] = anim[functions[this.stack[0]].alignment+functions[this.stack[2]].alignment];
			}
		} else { //double observer animals
			this.animals[0] = anim[functions[this.stack[1]].alignment+functions[this.stack[0]].alignment];
			this.animals[3] = anim[functions[this.stack[2]].alignment+functions[this.stack[3]].alignment];
			if (seed >= .6) {
				this.animals[1] = anim[functions[this.stack[2]].alignment+functions[this.stack[0]].alignment];
				this.animals[2] = anim[functions[this.stack[1]].alignment+functions[this.stack[3]].alignment];
			} else {
				this.animals[1] = anim[functions[this.stack[1]].alignment+functions[this.stack[3]].alignment];
				this.animals[2] = anim[functions[this.stack[2]].alignment+functions[this.stack[0]].alignment];
			}
		}

		this.head = {
			base:Math.floor(Math.random()*4),
			eye:Math.floor(Math.random()*13)

		};
	}
	act(weight) {
		var success = weight.score[this.stack[0]]*.75 + weight.score[this.stack[1]]*.25 + weight.score[this.stack[2]]*.05 +weight.score[this.stack[3]]*-.25;
		success += weight.animals[this.animals[1]];
		/*
		document.write(examples[this.stack[0]+this.stack[1]]+' is ');
		document.write(Math.round(success*100));
		document.write('% likely to go to dinner with you.');
		document.write('<br>');
		*/
		//fraction of 1. If over .75, success
	}
	speak(dialogue) {
		var text = ''
		var val;
		for (val in dialogue) {
			text += dialogue[val];
			//if ()
			if (Math.random()>=0.5) {
				text += random_item(connectors[this.stack[0]]);
			}
		}
		console.log(text);
		document.write(text);
		document.write('<br>');
	}
}



var traits = [ //adjectives grouped for 
	//Oe
	'openness',
	//Oi
	//Play
	'friendliness',
	'agreeableness',//Feminine?
	
]

var examples = {
	'NiFi':'Cha',
	'SiFi':'Dad',
	'NiFe':'Joc',
	'NiTi':'Reggie',
	'FeNi':'Seph, Matthew Joliffe',
	'FiNe':'Pearson, Andrew Otteson',
	'FiSi':'Ben Huynh',
	'FiSe':'Jared Miller, Alec Osborn',
	'TeSe':'Garrett',
	'TeNe':'Emma E.',
	'SiTi':'Nile',
	'FeSi':'Desiree',
	'SeFi':'Alec Guertin, Angellica, Luke Jones, Justin Zachman',
	'NeTi':'Me',
	'TiSe':'Matt',
	'NeFi':'Gage, John Avery',
	'NeTe':'Megan Owaga',
	'TiNe':'Adam King', //Low Blast
	'TiSi':'Adam Burford', //High blast
	'NeFe':'Matt Turcato',
	'FeNe':'Christopher Murphy',
	'NiTe':'Diana, Jason Moitosso, Meghan Jones, Taylor BSU',
	'TeNi':'John Hosmer, Jennifer Snow',
	'SeFe':'Caleb Parkerson',
	'SiFe':'Mary Coleman'
};

var actions = {
	'Invite to dinner':{
		score: {
			'Fe':1,
			'Te':1,
			'Fi':0.5,
			'Ti':-1,
			'Ne':0.5,
			'Se':1,
			'Ni':0,
			'Si':0
		},
		animals: {
			'Play':1,
			'Consume':.5,
			'Blast':0,
			'Sleep':-.5
		}

	}
};

var animals = {
	'Sleep':{
		'Exclamatory':[.1]
	},
	'Play':{
		'Exclamatory':[.7]
	},
	'Blast':{
		'Exclamatory':[.35]
	},
	'Consume':{
		'Exclamatory':[.25]
	},
};

var connectors = {
	'Si':['And then ','So ' ,'Next ','Which reminded me, ','Then '],
	'Se':['Which reminds me ','Speaking of which ','Anyhow ','Oh that just made me remember '],
	'Ni':['So that means ','So it\'s all tied together. ','And because of that ','Which means ','So ','Which is a lot like '],
	'Ne':['Which sounds an awful lot like ','If I\'m not mistaken ','If that\'s the case then ','I\'m pretty sure that means ','I wonder if '],
	'Fi':['Which felt right to me ','I know this has to be right ','I need to say this ','I feel like '],
	'Fe':['Does that sound right? ','Is that okay? ','If it\'s okay with you ','How does this sound? ','I feel like '],
	'Ti':['Therefore ','I think that means ','So it makes sense to me that ','Which means '],
	'Te':['Does that make sense? ','What do you think about that? ','Do you think that means ','If that makes sense to you. ']
}

var temp = ['moral/kind','smart/reasonable','fun','interesting/stimulating','familiar'];

var context = {
'Fe':['Connection','Compliments'],
'Ti':['Clever','Mentally stimulating'],
'Te':['Useful','Productive','Practical'],
'Ni':['Familiar,predictable,orderly'],
'Se':['Novel','Stimulating','Fun','Active'],
'Ne':['Novel','Stimulating','Fun','Change'],
'Fi':['Just','Fair','Considerate']
};


var dialogue = {
	"dialogue1":["You know, I just happened upon something interesting","I'm a collector of rare items","a collector of precious gems","You seem like you might be interested in gems","A (wo)man who recognizes the value of a stone's sparkle","Perhaps you would like to purchase some"]
};


/*
Weighting categories:
Actions (requested)
	- Fun
	- Responsible
	- 
Actions (a)
Dialogue
	- Listening/asking/showing interest
	- Talking/
	- 
	+ Worth noting that listening/talking should be a ratio. 
		- Blast Play wants to talk 90% of the time. 
		- Play Blast 80%
		- Blast Sleep 70%
		- Play Consume 60%
		- Sleep Blast 50% // maybe switch this and Play Consume
		- Consume Play 40%
		- Consume Sleep 20%
		- Sleep Consume 10%
	+ This impacts how long the character's dialogue is. And how much you should select asking vs. talking dialogue

*/


var player;
var characterList = [];//initialize random characters for game