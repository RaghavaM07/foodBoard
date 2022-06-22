# FoodBoard

![FoodBoard Home](https://res.cloudinary.com/dkoj9sebm/image/upload/v1655874515/Home_jyk12l.png)

## About
FoodBoard is web app that can be used to share recipes (yeah, its that simple 😜).

Its made with NodeJS, ExpressJS, Mongoose and EJS Templating Engine. UI built using [Materialize CSS](https://materializecss.com/).

## Features
- Simple interface 😀
- Easy registration - all you need is a name, email and a good passcode you can remember, and you are good to go!
- React to recipes - Vote and comment ✍️ to let others know how you feel about a recipe
- Vote mechanics - show how you like a particular recipe by upvoting (👍) or downvoting (👎) it
- Only registered users 🧍 can make new recipes, comment and vote
- Responsive UI 📱 , from Materialize CSS
- Refreshing color scheme, all bright and clean
- Single image for each recipe, enabling the author to set a definite expectation of the end product
- Home feed based on net positive impressions among all recipes ✨
- Uses [cloudinary](https://cloudinary.com/) for image storage ☁️
- Community driven - no admin, no authority 🚫

## Installation

### Requirements
For development, you will only need Node.js and the node package manager `npm` installed in your environement.

### Install

    $ git clone https://github.com/RaghavaM07/foodBoard.git
    $ cd foodBoard
    $ npm install

This should install all the required dependancies mentioned in the `package.json` file.

***
#### For dev environment

Set the required environment variables in a `.env` file.

#### For production environment

Set the required environment variables in the shell.

***

The following are the required variables:

|Variable|Purpose|
|---|---|
|PORT|The port on which the express server should listen for incoming connections.|
|MONGO_URI|URI of the mongoDB server.|
|SESSION_SECRET|A strong secret key to encrypt session details of current logged in users.|
|CLOUDINARY_CLOUD_NAME|Cloud name of the cloudinary account, available on the cloudinary account dashboard.|
|CLOUDINARY_API_KEY|API key of the cloudinary account, available on the cloudinary account dashboard.|
|CLOUDINARY_API_SECRET|API Secret of the cloudinary account, available on the cloudinary account dashboard.|

Run the app with
```bash
node index.js
```
## Usage
In order to make recipes, first create an account.

![LoginPage](https://res.cloudinary.com/dkoj9sebm/image/upload/v1655874089/foodBrd_README_img/loginPage_n4rppu.jpg)

### Recipe Creation
Head to `/recipes/new` to create a new recipe. Enter the required details and upload an image. Be sure to specify if its vegetarian 🥕 or non-vegetarian 🍗! Although not implemented, a feature can be placed in the `showRecpie.ejs` file to indicate if each recipe is vegetarian or not.

![NewRecipePage](https://res.cloudinary.com/dkoj9sebm/image/upload/v1655874090/foodBrd_README_img/NewRecipe_vmwwek.jpg)

### Users' Activity
Wait for the community to do its work by reacting to your recipe. The total score of the recipe is by how much the no. of upvotes is greater than the no. of downvotes (👍-👎). You can react on others' recipes too, all you need to be is logged in!

![RecipeHomePage](https://res.cloudinary.com/dkoj9sebm/image/upload/v1655874090/foodBrd_README_img/recipeHome_mv6h36.jpg)

_Mobile View_
![RecipeHomeMobile](https://res.cloudinary.com/dkoj9sebm/image/upload/v1655874974/MobileRecipeHome_vujysz.png)

### Viewing others' Recipes
Other users' recipes are available in a read-only format. You cannot edit and/or delete other users' recipes.

![RecipeShowPage](https://res.cloudinary.com/dkoj9sebm/image/upload/v1655874090/foodBrd_README_img/showRecipe_ryd04n.jpg)

### Editing a Recipe (Requires Authorization)
Found an error? Don't worry! Recipe authors (only) can edit the recipe. Click on the edit(pencil) icon below the recipe title or head to `/recipes/<recipeID>/edit` to get started.

Every field of the recipe can be edited - name, description, vegetarian/non-vegetarian flag, ingredients, instructions, times, serves and also the image. Just change what you need to and submit the edit form.

### Mistakes were made... (Recipe Deletion)(Requires Authorization)
Recipe authors (only) can delete the recipe. Deleting the recipe will
- delete all fields
- remove the recipe image from cloudinary storage
- delete all comments on the recipe
- **NOT** reduce the user's score obtained through the recipe

### Comment Editing
Comment editing is **not** possible in this version of the code, but the functionality can be added by modifying the `controllers/comments.js` and `middleware.js` files appropriately.

### Comment Deletion
Comment authors (only) can delete a comment from a recipe.


##### Notes
- The app was made only to showcase how the different technologies mentioned could be used in tandom to make something useful and creative. Additional features and improvements can be easily added to the existing code base with few difficulties.
- cloudinary's terms of use can be found [here](https://cloudinary.com/tos)

---
_Made by **Raghava Murugudu**_