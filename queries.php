<?php

  // database info and credentials
  require("dbinfo.php");

  // connect to database
  $connection = mysqli_connect($servername, $username, $password, $database);
  if ( mysqli_connect_errno() ) {
    print_r(mysqli_connect_error());
    exit();
  }

  if ($_GET['query'] == "getCoffeeShops") {

    // create parent node of XML file
    $dom = new DOMDocument("1.0");
    $node = $dom->createElement("coffeeShops");
    $parnode = $dom->appendChild($node);

    // get all the coffee shops from the table
    $query = "SELECT * FROM coffeeShops";
    $result = mysqli_query($connection, $query);
    if (!$result) { die('Invalid query: ' . mysql_error()); }

    header("Content-type: text/xml");

    // Iterate through the rows, adding XML nodes for each

    while ($row = mysqli_fetch_assoc($result)){
      // Add to XML document node
      $node = $dom->createElement("coffeeShop");
      $newnode = $parnode->appendChild($node);
      $newnode->setAttribute("id", $row['id']);
      $newnode->setAttribute("placeID",$row['placeID']);
      $newnode->setAttribute("category", $row['category']);
      $newnode->setAttribute("visitedDate", $row['visitedDate']);
    }

    echo $dom->saveXML();

  }

  if ($_GET['query'] == "addCoffeeShop") {

    $errMsg = "";
    if ($_POST['placeID']) { $placeID = $_POST['placeID']; }
    else { $errMsg .= "Invalid place ID. Please refresh the page and try again.<br>"; }
    if ($_POST['category'] == undefined) { $errMsg .= "Please select a category for the coffee shop.<br>"; }
    else { $category = $_POST['category']; }
    if (!$_POST['visitedDate'] && $_POST['category'] != 'bucketlist') { $errMsg .= "Please enter the date you visited the coffee shop.<br>"; }
    else { $visitedDate = $_POST['visitedDate']; }

    if ($errMsg != "") { echo $errMsg; exit(); }

    $query = "INSERT INTO `coffeeShops` (`placeID`, `category`, `visitedDate`) VALUES ('" . mysqli_real_escape_string($connection, $placeID) . "', '" . mysqli_real_escape_string($connection, $category) . "', '" . mysqli_real_escape_string($connection, $visitedDate) . "')";
    $result = mysqli_query($connection, $query);
    if (!$result) { die('Invalid query: ' . mysql_error()); }

    echo "<strong>Success!</strong> This coffee shop has been added to your MochaMap. Click <a href='https://kellymartin.me/portfolio/mochaMap'>here</a> to reload the map.";

  }

  if ($_GET['query'] == "updateCoffeeShop") {

    $errMsg = "";
    if ($_POST['placeID']) { $placeID = $_POST['placeID']; }
    else { $errMsg .= "Invalid place ID. Please refresh the page and try again."; }
    $category = $_POST['category'];
    if (!$_POST['visitedDate'] && $category != 'bucketlist') { $errMsg .= "Please enter the date you visited the coffee shop.<br>"; }
    //else { $visitedDate = $_POST['visitedDate']; }

    if ($errMsg != "") { echo $errMsg; exit(); }

    if ($_POST['visitedDate'] == undefined) {
      $query = "UPDATE `coffeeShops` SET `category`='" . mysqli_real_escape_string($connection, $category) . "' WHERE `placeID` = '" . mysqli_real_escape_string($connection, $placeID) . "'";
    }
    else {
      $visitedDate = $_POST['visitedDate'];
      $query = "UPDATE `coffeeShops` SET `category`='" . mysqli_real_escape_string($connection, $category) . "',`visitedDate`='" . mysqli_real_escape_string($connection, $visitedDate) . "' WHERE `placeID` = '" . mysqli_real_escape_string($connection, $placeID) . "'";
    }

    $result = mysqli_query($connection, $query);
    if (!$result) { die('Invalid query: ' . mysql_error()); }

    echo "<strong>Success!</strong> This coffee shop has been updated on your MochaMap. Click <a href='https://kellymartin.me/portfolio/mochaMap'>here</a> to reload the map.";

  }

?>
