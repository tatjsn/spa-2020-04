const cache = {};

export async function getAllMembers() {
  if (cache.allMembers) {
    return cache.allMembers;
  }
  const result = await fetch('/data/index.php?%E7%9C%9F%E5%90%8D%E4%B8%80%E8%A6%A7%28%E3%82%AF%E3%83%A9%E3%82%B9%E3%83%BB%E3%83%AC%E3%82%A2%E3%83%AA%E3%83%86%E3%82%A3%E5%88%A5%29');
  const html = await result.text();
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(html, 'text/html');
  const tableBody = doc.querySelectorAll('tbody')[2];
  const tds = tableBody.querySelectorAll('td');
  const product = [];
  let i = 0;
  for (const td of tds) {
    const anchor = td.querySelector('a');
    if (anchor) {
      const url = anchor.href.replace('https://grand_order.wicurio.com/', '/data/');
      product.push({ id: ++i, name: anchor.firstChild.data, url });
    }
  }
  cache.allMembers = product;
  return product;
}

export async function getMemberById(id) {
  if (cache.memberById && cache.memberById[id]) {
    return cache.memberById[id];
  }
  const allMembers = await getAllMembers();
  const member = allMembers.find(m => m.id === id);
  const result = await fetch(member.url);
  const html = await result.text();
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(html, 'text/html');
  const tableBody = doc.querySelectorAll('tbody')[1];
  const classTd = tableBody.querySelectorAll('td')[1];
  const product = { ...member, class: classTd.firstChild.data };
  if (!cache.memberById) {
    cache.memberById = {};
  }
  cache.memberById[id] = product;
  return product;
}
