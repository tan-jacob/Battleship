const xhttp = new XMLHttpRequest();
const GET = 'GET'
const POST = 'POST';
const PUT = 'PUT';

// await Talk.ready;
// const me = new Talk.User({
//   id: '123456',
//   name: 'Alice',
//   email: 'alice@example.com',
//   photoUrl: 'https://demo.talkjs.com/img/alice.jpg',
//   welcomeMessage: 'Hey there! How are you? :-)',
// });
// const session = new Talk.Session({
//   appId: 'tw1KnlO1',
//   me: me,
// });
// const other = new Talk.User({
//   id: '654321',
//   name: 'Sebastian',
//   email: 'Sebastian@example.com',
//   photoUrl: 'https://demo.talkjs.com/img/sebastian.jpg',
//   welcomeMessage: 'Hey, how can I help?',
// });

// const conversation = session.getOrCreateConversation(
//   Talk.oneOnOneId(me, other)
// );
// conversation.setParticipant(me);
// conversation.setParticipant(other);

// const inbox = session.createInbox({ selected: conversation });
// inbox.mount(document.getElementById('talkjs-container'));