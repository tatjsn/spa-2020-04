export async function getAllMembers() {
  return [
    { id: 1, name: 'Mr. X' },
    { id: 2, name: 'Ms. Y' },
  ];
}

export async function getMemberById(id) {
  switch (id) {
    case 1:
      return { id: 1, name: 'Mr. X', class: 'Saber' };
    case 2:
      return { id: 1, name: 'Ms. Y', class: 'Caster' };
  }
  throw new Error('Unknown ID');
}
