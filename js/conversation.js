var conversation = {
  greetings: [
    "Hi, my name is %NAME%",
    "Heyo! I'm %NAME%",
    "Say... Dontcha? Oh, I thought I knew you. The Name's %NAME%",
    "Yeah yeah yeah. Introductions and all. Just call me %NAME%",
    "Oh, uh... Are you? You must be new. I'm %NAME%",
    "Hey I'm %NAME%, who are you?",
    "I've heard some deep stuff about you %PLAYERNAME%. By the way, I'm %NAME%",
    "Hi! I'm %NAME%",
    "It's me! %NAME%. Surely you've heard of me!",
    "Pleased to meet you, my name's %NAME%",
    "Fate crosses our paths, %PLAYERNAME%. I'm %NAME%",
    "Hello, I'm %NAME%",
    "You look a bit... unusual. Not from around here are you? I'm %NAME%",
    "Do I look suspicious? Nevermind... Call me %NAME%",
  ],
  followup: [
    "Oh! Oh! Glad you're still here, %PLAYERNAME%! Always a pleasant face to see darting into my periphery.",
    "%PLAYERNAME%? What a pleasant surprise! What can I do for you?",
    "You remember me, right? Don't tell me you already forgot our conversation!",
    "Hyuck, hyuck, hyuck! Darndest tootin' grass I ever let my twinklin' toes touch.",
    "What interesting... Clothes? Where on earth did you find them?",
  ],
  recent: [
    "%PLAYERNAME% %PLAYERNAME% %PLAYERNAME% %PLAYERNAME% %PLAYERNAME%. What are you doing still standing around here? There's a whole world out there for you!",
    "Oh. You again? You seem to like hanging around.",
    "Oh. You again? What do you want?",
    "Didn't we just speak? Well, my memory isn't what it used to be. What's the haps, paps?",
    "It's my lucky day. You're stuck to me like glue! What can I do you for?",
    "I really need to get more sleep. I could've sworn we just talked!",
  ],
};
var responseOptions = {
  basic: ["Active Quests", "Favor"],
  quest: [
    "Is something wrong",
    "Is something the matter",
    "Is everything alright",
    "Is everything okay",
    "Can I help you",
    "Is there something I can do to help",
  ],
  bonus: [
    "Why is everyone here so different",
    "What are those weird things buried in the ground",
  ],
};

var responses = {
  disambig: {
    "first char": ["represents type of response", "q: quest", "g: general"],
  },
  smalltalk: {
    0: [
      "Be careful stepping under the trees. I hear that leaves and nuts could fall and crack your noggin'. Turn your brain to a banana, if you know what I'm getting at! Hehe",
      "Congrats on picking the correct banana, %PLAYERNAME%. I'm not sure what that is, but I like it!",
      "Good thing I live in a town. The countryside is filled with dangers... You seem like just the type to succumb to misfortune out there.",
      "If it were up to me, you'd be popular and attractive. But we can't all get what we want.",
      "This is the LAST time I talk to a stranger! You simply don't understand how to cater to my preferred manner of communication. Don't talk to me until we've had some deep conversations",
      "Ya know, I hear there's all sorts of adventure to be had in this land. Well trying on a mismatch pair of socks is about all the adventure I need in my life!",
      "What do you think of this %PLAYERNAME%? Feed a man to a fish and he swims for a day. Teach a fish to act like a man, and you get thrown into prison for exploitation of wildlife. Doesn't that raise a few red flags?",
      "Can you believe what passes for birds these days? I swear the government gets lazier and lazier each year!",
      "Wait... You don't actually expect me to stand around all day in the harsh sunlight do you!? I've got important business to attend to, %PLAYERNAME%. In the TUNNELS!",
      "Ever wonder why the call me %NAME%? Well it's a funny story. And YOU don't get to hear it! I hardly know you, silly.",
      "A lot of people like to say this is the greateset town in all the land... Most of them have never stepped foot outside of it. What do you say? You seem well traveled.",
      "Isn't this a lovely town we live in? I truly feel bad for you. Here today, gone tomorrow.\nAh well... C'est la vie.",
      "Let 'er rip! That's my motto in life. If you're planning something sneaky, I want in. Deal?",
      "I lead a fascinating life, but it's difficult to describe to smaller minded individuals. Perhaps.",
      "If you get fed up with the snark, you could always try not barging in on strangers and trying to start a conversation with no purpose.",
      "Get a job? Hah! That ship has sailed off into the night long ago. You simply fell asleep at the dock and never noticed.",
    ],
    1: [
      "Oh boy, you wouldn't believe the day I've had. I mean, YOU would! You get where I'm coming from, right?",
      "I'd really rather not. I wish you wouldn't put me in a position like this. How do you think I look to the passers by if I refuse to help a moocher like you?",
      "I need to get better friends. Why don't you ask what YOU can do for ME instead? Hm?",
      "Here's a little juicy secret, %PLAYERNAME%, I've never eaten a fruit rollup! There, I feel so much better having shared that!",
      "Oh... I'd be happy to help you. But you seem so capable, I'm sure I'd just get in the way, right?",
      "Naturally you would ask such a competent citizen as myself for help. But I worry your situation places you beyond help.",
      "%PLAYERNAME%, do you really think people will remember you when you're gone? Thoughts like that keep me up at night. Like, what is the impact I'm having on the world?",
    ],
  },
  quest: {
    q001a: { text: "Did you lose %ITEM% when you were with %BROTHER%?" },
  },
  favor: {
    0: [
      "Meh... I don't know. What's in it for me?",
      "I don't really know you that well. Why should I?",
      "Don't hold your breath. I'm a busy one, and there's a lot of higher priorities on my list.",
      "I mean, we've hardly met, right? Is there a reason I should help?",
    ],
    1: [
      "Sure! Anything for you",
      "Yeah, why not?",
      "Of course! What can I do for you?",
      "Hey, whatever you need, partner.",
      "I got you. Say the word",
      "Say no more. You can count on me!",
    ],
  },
};

var adjective = {
  wealthy: {},
  rich: {},
  poor: {},
};

var characterAdj = { positive: ["adaptable"] };

/*
Each adjective is mapped within different entity classes:

Character: [descriptive trait adjectives - reliable, onerous, hornery, devestated, depraved]
Object: [descriptive inanimate traits - hard, unstable, stunning]
Food: [Descriptive taste related trait - sour, rich, decadent]
Place: [descriptive locational/trait adjectives - high, enormous, flourishing]

Each adjective is also an object within the greater adjective variable. 
This provides information about what the adjective implies and how it should behave:
E.g. 'Rich' for a character means they should have high money, for food means it should have positive taste attribute

Each character follows the following rules
Has one innate adjective that desribes them, generated from the start. 
Can be described by any general term relative to who is saying it. Do they like them? Do they have more money
*/
