export const MOCK_ITEMS = [
  {
    id: '1',
    title: 'Black Laptop Bag',
    description: 'Lost at the Engineering building. Contains no showering material 🛁🧼🚿🧽🧴.',
    category: 'accessories',
    location: 'Engineering Building',
    date: new Date(),
    status: 'lost',
    userId: '1',
    isAnonymous: false,
  },
  {
      id: '2',
      title: 'MacBook Pro',
      description: 'Found in the hammer lab.',
      category: 'electronics',
      location: 'University Library',
      date: new Date(),
      status: 'found',
      userId: '2',
      isAnonymous: false
  },
  {
    id: '3',
    title: 'Red Backpack',
    description: 'Forgotten at Axinn library on the second floor.',
    category: 'bags',
    location: 'Library',
    date: new Date(Date.now() - 2592000000), // 30 days ago
    status: 'found',
    userId: '3',
    isAnonymous: false,
  },
  {
    id: '4',
    title: 'Gold Keychain',
    description: 'last time i remember it being around was in the phys building',
    category: 'accessories',
    location: 'Cafeteria',
    date: new Date(Date.now() - 604800000), // One week ago
    status: 'lost',
    userId: '4',
    isAnonymous: true,
  },
  {
    id: '5',
    title: 'Textbooks (Calculus & History)',
    description: 'Left unattended in a study room (SE203).',
    category: 'books',
    location: 'Student Union',
    date: new Date(),
    status: 'lost',
    userId: '5',
    isAnonymous: false,
  },
  {
    id: '6',
    title: 'Black Headphones',
    description: 'left on the bus that went to Target td.',
    category: 'electronics',
    location: 'Public Bus (Route 5)',
    date: new Date(Date.now() - 172800000), // Two days ago
    status: 'found',
    userId: '6',
    isAnonymous: true,
  },
  {
    id: '7',
    title: 'Wallet (Brown Leather)',
    description: 'Lost near the ATM in the Main Building.',
    category: 'personal',
    location: 'Main Building (ATM)',
    date: new Date(Date.now() - 1296000000), // Two weeks ago
    status: 'lost',
    userId: '7',
    isAnonymous: false,
  },
  {
    id: '8',
    title: 'Umbrella (Blue with Stripes)',
    description: 'Left by the bike racks near the dorms.',
    category: 'other',
    location: 'Stuyvesant dorms (Bike Racks)',
    date: new Date(Date.now() - 3456000000000), // about 109 years ago...
    status: 'found',
    userId: '8',
    isAnonymous: true,
  },
  {
    id: '9',
    title: 'Silver Watch',
    description: 'Lost during gym class (Gymnasium A).',
    category: 'accessories',
    location: 'Gymnasium A',
    date: new Date(Date.now() - 864000000), // One day ago
    status: 'lost',
    userId: '9',
    isAnonymous: false,
  },
  {
    id: '10',
    title: 'ID Card (Student)',
    description: 'Lost somewhere on campus.',
    category: 'documents',
    location: 'Unknown',
    date: new Date(Date.now() - 1728000000), // Two days ago
    status: 'lost',
    userId: '10',
    isAnonymous: true,
    },
] as const; // to be read only

export const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'Diddy',
    lastMessage: 'That\'s my laptop, where did you find it',
    timestamp: new Date('2023-05-15T10:30:00'),
    unread: true,
  },
  {
    id: '2',
    sender: 'Hmmm',
    lastMessage: 'PSafe says they never received that item?',
    timestamp: new Date('2023-05-14T15:45:00'),
    unread: false,
  },
  {
    id: '3',
    sender: 'Mike Tyson',
    lastMessage: 'Come here',
    timestamp: new Date('2023-05-13T09:20:00'),
    unread: true,
  },
] as const;

export const MOCK_USER = {
  id: '1',
  name: 'Mani Tofigh',
  email: 'mtofigh1@pride.hofstra.edu',
  rewardPoints: 150,
  itemsPosted: 5,
  itemsReturned: 3,
} as const;
