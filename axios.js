let axios = require('axios');

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

let login = async (data) => {
  console.log("============================");
  console.log("POST /tokens");
  console.log(data);
  console.log("");
  let response = await axios.post('/tokens', data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let logout = async () => {
  console.log("============================");
  console.log("DELETE /tokens");
  console.log("");
  let response = await axios.delete('/tokens');
  console.log(`Status: ${response.status}`);
  console.log("");

  return response;
};

let createUser = async (data) => {
  console.log("============================");
  console.log("POST /users");
  console.log(data);
  console.log("");
  let response = await axios.post('/users', data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let getUser = async (id) => {
  console.log("============================");
  console.log(`GET /users/${id}`);
  console.log("");
  let response = await axios.get(`/users/${id}`);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let putUser = async (id, data) => {
  console.log("============================");
  console.log(`PUT /users/${id}`);
  console.log("");
  let response = await axios.put(`/users/${id}`, data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let deleteUser = async (id) => {
  console.log("============================");
  console.log(`DELETE /users/${id}`);
  console.log("");
  let response = await axios.delete(`/users/${id}`);
  console.log(`Status: ${response.status}`);
  console.log("");

  return response;
};

let searchUsers = async (queryString) => {
  console.log("============================");
  console.log(`GET /users?${queryString}`);
  console.log("");
  let response = await axios.get(`/users?${queryString}`);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let postUserAddresses = async (id, data) => {
  console.log("============================");
  console.log(`POST /users/${id}/addresses`);
  console.log("");
  let response = await axios.post(`/users/${id}/addresses`, data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let deleteUserAddresses = async (id, addressId) => {
  console.log("============================");
  console.log(`DELETE /users/${id}/addresses/${addressId}`);
  console.log("");
  let response = await axios.delete(`/users/${id}/addresses/${addressId}`);
  console.log(`Status: ${response.status}`);
  console.log("");

  return response;
};

let postRestaurant = async (data) => {
  console.log("============================");
  console.log(`POST /restaurants`);
  console.log("");
  let response = await axios.post(`/restaurants`, data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let searchRestaurants = async (queryString) => {
  console.log("============================");
  console.log(`GET /restaurants?${queryString}`);
  console.log("");
  let response = await axios.get(`/restaurants?${queryString}`);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let getRestaurant = async (id) => {
  console.log("============================");
  console.log(`GET /restaurants/${id}`);
  console.log("");
  let response = await axios.get(`/restaurants/${id}`);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let putRestaurant = async (id, data) => {
  console.log("============================");
  console.log(`PUT /restaurants/${id}`);
  console.log("");
  let response = await axios.put(`/restaurants/${id}`, data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let postItem = async (restaurantId, data) => {
  console.log("============================");
  console.log(`POST /restaurants/${restaurantId}/items`);
  console.log("");
  let response = await axios.post(`/restaurants/${restaurantId}/items`, data);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let searchItems = async (restaurantId, queryString) => {
  console.log("============================");
  console.log(`GET /restaurants/${restaurantId}/items?${queryString}`);
  console.log("");
  let response = await axios.get(`/restaurants/${restaurantId}/items?${queryString}`);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};

let deleteItem = async (restaurantId, itemId) => {
  console.log("============================");
  console.log(`DELETE /restaurants/${restaurantId}/items/${itemId}`);
  console.log("");
  let response = await axios.delete(`/restaurants/${restaurantId}/items/${itemId}`);
  console.log(`Status: ${response.status}`);
  console.log("");

  return response;
};

let searchOrders = async (queryString) => {
  console.log("============================");
  console.log(`GET /orders?${queryString}`);
  console.log("");
  let response = await axios.get(`/orders?${queryString}`);
  console.log(`Status: ${response.status}`);
  console.log(JSON.stringify(response.data, null, 2));
  console.log("");

  return response;
};



(async () => {
  let response;

  try {
    // Attempt to login and remove the user from a previous run, if one exists.
    try {
      response = await login({
        email: "iamjwc@gmail.com",
        password: "password",
      });
      console.log(response.data)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      await deleteUser(response.data.user.id);
      delete axios.defaults.headers.common.Authorization;
    } catch (error) {
      console.log(`Status: ${error.response.status}`);
      console.log(error.response.data);
      console.log("");
    }

    response = await createUser({
      email: "iamjwc@gmail.com",
      firstName: "Justin",
      lastName: "Camerer",
      password: "password",
      addresses: [
        {
          street: '123 Fake St, Apt 1L',
          city: 'Brooklyn',
          state: 'NY',
          zip: '11211',
          country: 'USA',
        }
      ],
    });

    // Attempt to login with the wrong password
    try {
      response = await login({
        email: "iamjwc@gmail.com",
        password: "WRONG_PASSWORD",
      });
    } catch (error) {
      console.log(`Status: ${error.response.status}`);
      console.log(error.response.data);
      console.log("");
    }

    // Attempt to login with the correct password
    response = await login({
      email: "iamjwc@gmail.com",
      password: "password",
    });

    // Put the token in the Auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

    // Get the current user document
    let currentUserId = response.data.user.id;
    response = await getUser(currentUserId);

    // Attempt to find a user that doesn't exist
    try {
      await getUser("5cb7f26a22b5622d08167f97");
    } catch (error) {
      console.log(`Status: ${error.response.status}`);
      console.log(error.response.data);
      console.log("");
    }

    // Attempt to find a user with an id that is in the wrong format
    try {
      await getUser("USER_ID_THAT_WILL_THROW_AN_ERROR");
    } catch (error) {
      console.log(`Status: ${error.response.status}`);
      console.log(error.response.data);
      console.log("");
    }

    // Update the user's fist name to be something absurd.
    await putUser(currentUserId, {
      firstName: "JustinsUpdatedName",
      lastName: "Camerer",
    });

    // Search for that absurd name.
    await searchUsers("firstName=JustinsUpdatedName");

    // Add an address to the user.
    await postUserAddresses(currentUserId, {
      street: '456 Real St, Apt 1R',
      city: 'Brooklyn',
      state: 'NY',
      zip: '12121',
      country: 'USA',
    });

    // Delete that fake address that created first.
    let badAddressId = response.data.user.addresses[0].id;
    await deleteUserAddresses(currentUserId, badAddressId);

    // Lets look at the pretty, correct address and user object.
    await getUser(currentUserId);

    // If there is already a restaurant called Ippudo, don't create a new one.
    response = await searchRestaurants(`name=Ippudo`);

    if (response.data.restaurants.length == 0) {
      await postRestaurant({
        name: 'Ippudo',
        description: "Justin's favorite ramen restaurant",
        longitude: 40.7309353,
        latitude: -73.9902445,
      });
    }

    // Searching for a restaurant called Ippudo 1m away from Sobaya should return nothing.
    await searchRestaurants(`name=Ippudo&longitude=40.7295518&latitude=-73.9880036&maxDistance=1`);
 
    // Searching for a restaurant called Ippudo 1000m away from Sobaya should return Ippudo.
    response = await searchRestaurants(`name=Ippudo&longitude=40.7295518&latitude=-73.9880036&maxDistance=1000`);
    let restaurantId = response.data.restaurants[0].id

    // Once we've found that restaurant, let's just get it again, to make use of the GET /restaurants/:id endpoint.
    await getRestaurant(restaurantId);

    // Make the description of the restaurant more exciting.
    await putRestaurant(restaurantId, {
      description: `${response.data.restaurants[0].description}!!`,
    });

    // Find all items and delete them so we can start from scratch.
    response = await searchItems(restaurantId, "")
    await Promise.all(response.data.items.map(item => {
      deleteItem(restaurantId, item.id);
    }));

    // Create a few menu items for the restaurant.
    await postItem(restaurantId, {
      name: 'Tonkotsu Ramen',
      description: "Mmmmmm..... porky.",
      price: 1100,
      dietaryRestrictions: ["carnivore", "salty"],
    });
    await postItem(restaurantId, {
      name: 'Miso Ramen',
      description: "Mmmmmm..... miso-y.",
      price: 1000,
      dietaryRestrictions: ["vegan", "salty"],
    });
    await postItem(restaurantId, {
      name: 'Pork Buns',
      description: "Mmmmmm..... also porky.",
      price: 500,
      dietaryRestrictions: ["carnivore"],
    });

    // Find all the salty foods.
    await searchItems(restaurantId, `dietaryRestrictions[]=salty`);

    // Find both things with meat
    await searchItems(restaurantId, `dietaryRestrictions[]=carnivore`);

    // Just show the one thing thats both salty and has meat
    await searchItems(restaurantId, `dietaryRestrictions[]=carnivore&dietaryRestrictions[]=salty`);

    // Just show the one item that is <= $10 and is salty
    await searchItems(restaurantId, `price=1000&dietaryRestrictions[]=salty`);

    // User should currently have no orders.
    await searchOrders(`userId=${currentUserId}`);

    // Didn't quite get to this.
    //await postOrder({
    //});

    await logout({
      email: "my email",
      password: "my passs",
    });
  } catch (error) {
    console.error(error);
  }
})();