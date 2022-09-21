export const fetchImageMetadata = (id) => {
  return {
    id,
    title: 'Sunset',
    description: 'Taken in Mexico - may be useful in an advertisement',
    creator: 'Steven A. Brown',
    date: new Date()
  };
};

export const createUser = (userName) => {
  console.log('saving..');
  console.log(`user "${userName}" created`);
}
