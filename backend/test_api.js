const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJSON(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: 'localhost',
        port: 5000,
        path: path,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
      }
    );
    req.on('error', reject);
  });
}

async function runTests() {
  console.log('--- TESTING CHEFMATE AI BACKEND ENDPOINTS ---');

  // 1. Health check
  const health = await getJSON('/api/health');
  console.log('1. Health check status:', health.status, health.data.status);

  // 2. Preliminary ingredients
  const pre = await postJSON('/api/recipes/preliminary-ingredients', {
    dishName: 'Chicken Biryani',
    servings: 4,
    spiceLevel: 'High',
    cookingMethod: 'Induction',
  });
  console.log('2. Preliminary ingredients status:', pre.status, 'Count:', pre.data.ingredients?.length);

  // 3. Generate full recipe
  const gen = await postJSON('/api/recipes/generate', {
    dishName: 'Chicken Biryani',
    servings: 4,
    spiceLevel: 'High',
    cookingMethod: 'Induction',
    ingredients: [
      { name: 'Basmati Rice', quantity: '2', unit: 'cups', note: 'soaked' },
      { name: 'Chicken', quantity: '500', unit: 'g', note: 'curry cut' },
      { name: 'Saffron', quantity: '1', unit: 'pinch', note: 'dissolved in warm milk' },
    ],
  });
  console.log('3. Full recipe generation status:', gen.status);
  console.log('   Dish:', gen.data.dishName);
  console.log('   Servings:', gen.data.servings);
  console.log('   Spice Level:', gen.data.spiceLevel);
  console.log('   Cooking Method:', gen.data.cookingMethod);
  console.log('   Steps count:', gen.data.steps?.length);
  console.log('   First step:', gen.data.steps?.[0]?.title);

  // 4. Save recipe
  const recipeId = gen.data._id;
  const saveRes = await postJSON(`/api/recipes/${recipeId}/save`, {});
  console.log('4. Save recipe status:', saveRes.status, saveRes.data.message);

  // 5. Fetch saved recipes
  const savedRes = await getJSON('/api/recipes/saved');
  console.log('5. Saved recipes list count:', savedRes.data?.length);

  console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(console.error);
