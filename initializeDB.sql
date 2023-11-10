
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*-----------------------------------------------------------------------------------------------*/
/* Locations                                                                                     */
/*-----------------------------------------------------------------------------------------------*/
CREATE TABLE locations (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text NOT NULL,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*-----------------------------------------------------------------------------------------------*/
/* Categories                                                                                    */
/*-----------------------------------------------------------------------------------------------*/
CREATE TABLE categories (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text NOT NULL,
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/*-----------------------------------------------------------------------------------------------*/
/* Items                                                                                         */
/*-----------------------------------------------------------------------------------------------*/
CREATE TABLE items (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text NOT NULL,
  category_id int(11) NOT NULL,
  image_size int(11) DEFAULT NULL,
  image longblob DEFAULT NULL,
  PRIMARY KEY(id),
  KEY(category_id),
  CONSTRAINT constr_category FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*-----------------------------------------------------------------------------------------------*/
/* Entries                                                                                       */
/*-----------------------------------------------------------------------------------------------*/
CREATE TABLE entries (
  id int(11) NOT NULL AUTO_INCREMENT,
  item_id int(11) NOT NULL,
  location_id int(11) NOT NULL,
  number_of_items int(11) NOT NULL,
  PRIMARY KEY(id),
  KEY(item_id),
  KEY(location_id),
  CONSTRAINT constr_item FOREIGN KEY (item_id) REFERENCES items (id),
  CONSTRAINT constr_location FOREIGN KEY (location_id) REFERENCES locations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/*-----------------------------------------------------------------------------------------------*/
/* Recipes_Dishes                                                                                */
/*-----------------------------------------------------------------------------------------------*/
CREATE TABLE recipes_dishes (
  id int(11) NOT NULL AUTO_INCREMENT,
  name text NOT NULL,
  preparation text NOT NULL,
  category_id int(11) NOT NULL,
  image_size int(11) DEFAULT NULL,
  image longblob DEFAULT NULL,
  PRIMARY KEY(id),
  KEY(category_id),
  CONSTRAINT constr_category2 FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*-----------------------------------------------------------------------------------------------*/
/* Recipes_Ingredients                                                                           */
/*-----------------------------------------------------------------------------------------------*/
CREATE TABLE recipes_ingredients (
  id int(11) NOT NULL AUTO_INCREMENT,
  dish_id int(11) NOT NULL,
  amount text NOT NULL,
  name text NOT NULL,
  PRIMARY KEY(id),
  KEY(dish_id),
  CONSTRAINT constr_dish FOREIGN KEY (dish_id) REFERENCES recipes_dishes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `recipes_ingredients` ADD `additionalTitle` TEXT NULL DEFAULT NULL AFTER `name`; 