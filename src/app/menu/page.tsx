'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Contact Us', href: '/contact' },
];

const menuTabs = [
  { id: 'main', name: 'Main Menu' },
  { id: 'lunch', name: 'Lunch Menu' },
  { id: 'sunday', name: 'Sunday Menu' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'children', name: "Children's Menu" },
];

export default function MenuPage() {
  const [activeMenu, setActiveMenu] = useState('main');
  return (
    <div className="min-h-screen">
      <Header />

      {/* Page Header */}
      <section className="py-16 bg-[#f8f6f1]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#2d4a4a]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#2d4a4a]">Menus</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-[#2d4a4a] mb-4">Our Menus</h1>
          <div className="section-divider" />
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Discover our selection of menus featuring the finest dishes in Epping, crafted with classic French and English techniques.
          </p>
        </div>
      </section>

      {/* Menu Tabs */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {menuTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMenu(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all uppercase tracking-wider text-sm ${
                  activeMenu === tab.id
                    ? 'bg-[#2d4a4a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 bg-[#f8f6f1] min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Main Menu */}
          {activeMenu === 'main' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Main Menu</h2>
                <p className="text-gray-600 italic">Please make your server aware of any allergens prior to ordering</p>
              </div>

              {/* Starters */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Starters</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Bread & Olives" price="6" description="Ciabatta Bread, Mixed Olives, Green Olive Tapenade, Infused Whipped Butter" />
                  <MenuItem name="Scallops" price="14" description="Served with a Pea Purree, Mixed Peppers" />
                  <MenuItem name="Prawn Star Martini" price="11" description="King Prawns in a Home-Made Marie-Rose Sauce With Lettuce, Paprika Cracker & Lemon" />
                  <MenuItem name="Tiger Prawns" price="14" description="Headless & Butterflied, cooked in a Garlic-Citrus Butter, With a Ciabatta slice" />
                  <MenuItem name="Fennel, Pesto & Mozzarella Arancini" price="11" description="With Balsamic Pomodoro & a Garlic Pesto Dressing" note="Vegan option available" />
                  <MenuItem name="Pork Trio" price="9" description="Pan Fried Pork Loin, with Crispy Bacon & Black Pudding, Apple Sauce, Sage, Lemon and Garlic" />
                  <MenuItem name="Soup of The Day" price="7" description="Served with ½ a Cheese Toastie" />
                  <MenuItem name="Goats Cheese Salad (V)" price="9" description="Served on a Pan-Fried Portobello Mushroom, Mixed Leaf, Walnuts and Balsamic dressing" />
                  <MenuItem name="Devil's on Horse Back" price="6" description="Dates wrapped in Bacon, in a Mustard Cream Sauce, With Ciabatta Slice & Whipped Butter" />
                  <MenuItem name="Sauté Garlic Chestnut Mushroom Salad (Ve)" price="9" description="Chestnut Mushrooms, Pan Fried with a Vegan Garlic & Citrus Butter Served with Sliced Ciabatta & Baby Leaf Salad" />
                </div>
              </div>

              {/* Mains */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Mains</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Vegan Mediterranean Vegetable Tart" price="16" description="Served with Potato Salad and Tenderstem Broccoli" />
                  <MenuItem name="Vegan Nut & Mushroom Wellington" price="19.95" description="Served With a Garlic & Herb Mash, Carrot Puree & Vegetable Gravy" />
                  <MenuItem name="Full Monty Burger" price="15.99" description="Beef, Chicken or Thai Infused Vegan Patty, Mature Cheddar, Streaky Bacon, House Sauce, Lettuce & Red Onion, Tomato, Gherkin & a Onion Ring with Chips." />
                  <MenuItem name="King Prawn & Chorizo Tagliatelle" price="18" description="Creamy Garlic, Parsley & Chilli Sauce, Spinach & Cherry Tomato's" note="Swap Prawns For Chicken Or Tenderstem for (V)" />
                  <MenuItem name="Lamb Trio" price="27" description="French Trim Lamb Best End, Mini Shepard's Pie & a Lamb Braise, Served with, Tender stem Broccoli & Red Wine Jus" />
                  <MenuItem name="Chicken Milanese" price="17" description="Served With Spaghetti Arrabbiata" />
                  <MenuItem name="Free Range, Skin-On, Chicken Supreme" price="19" description="Served with a Sauvignon Blanc & Mushroom Sauce, Sauté Potatoes, Courgette & Asparagus" />
                  <MenuItem name="Fillet Steak" price="38" description="8oz 28 Day Matured Fillet Steak with A Mini Steak & Ale Pie, Grilled Portobello Mushroom & Tomato, Served with Peppercorn Sauce" />
                  <MenuItem name="Classic Shepherd's Pie" price="16" description="Served With A Rich Red Wine Gravy" />
                  <MenuItem name="Fresh Lobster" price="54" description="Whole Hot Buttered Lobster with Garlic & Herb Butter (1 1/4 lb. uncooked) (GF)" />
                  <MenuItem name="Salmon En Croute" price="20" description="Served with Dauphinois Potatoes, Buttered Leeks & a Sauvignon Blanc Cream Sauce" />
                </div>
              </div>

              {/* Sides */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Sides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <SideItem name="Sauté Potatoes" price="6" />
                  <SideItem name="Sweet Potato or Normal Fries" price="4" />
                  <SideItem name="Triple Cooked Chips Tossed in Parmesan, Truffle Oil & Parsley" price="6" />
                  <SideItem name="Broccoli, Asparagus, Courgette" price="6" />
                  <SideItem name="Mac'n' Cheese" price="6" />
                  <SideItem name="Garlic Ciabatta Bread" price="5" />
                  <SideItem name="Gratin Dauphinoise Potatoes" price="5" />
                  <SideItem name="Mac'n' Cheese Bites" price="6" />
                </div>
              </div>
            </div>
          )}

          {/* Sunday Menu */}
          {activeMenu === 'sunday' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Sunday Menu</h2>
                <p className="text-gray-600">Traditional Sunday Roasts with all the trimmings</p>
              </div>

              {/* Starters */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Starters</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Bread & Olives" price="6" description="Ciabatta Bread, Mixed Olives, Green Olive Tapenade, Infused Whipped Butter" />
                  <MenuItem name="Pork Trio" price="9" description="Pan fried Pork Loin, with Crispy Bacon & Black Pudding, Apple Sauce, Sage, Lemon & Garlic" />
                  <MenuItem name="Prawn Star Martini" price="11" description="King Prawns in a Home-Made Marie-Rose Sauce With Lettuce, Paprika Cracker & Lemon" />
                  <MenuItem name="Pan Seared Scallops" price="14" description="Served with Pancetta, Pea Puree & Mixed Peppers" />
                  <MenuItem name="Fresh Maldon Oysters - £4 each . £20 for 6" price="" description="Served with a Chilled, Citrus Mignonette" />
                  <MenuItem name="Goats Cheese Salad (V)" price="9" description="Served on a Pan-Fried Portobello Mushroom, Mixed Leaf, Walnuts & Balsamic dressing" />
                  <MenuItem name="Tiger Prawns" price="14" description="Cooked in a Garlic-Citrus Butter, With a Ciabatta slice" />
                  <MenuItem name="Sauté Garlic Chestnut Mushroom Salad (Ve)" price="9" description="Chestnut Mushrooms, Pan Fried with a Vegan Garlic & Citrus Butter Served with Sliced Ciabatta & Baby Leaf Salad" />
                  <MenuItem name="Devil's on Horse Back" price="6" description="Dates wrapped in Bacon, in a Mustard Cream Sauce, With Ciabatta Slice & Whipped Butter" />
                  <MenuItem name="Vegan Fennel & Mozzarella Arancini" price="12" description="With Pomodoro & a Balsamic Glaze" />
                </div>
              </div>

              {/* Mains */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Mains</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Roast Sirloin of Beef" price="23" description="Sliced roasted beef sirloin" />
                  <MenuItem name="Fillet Steak" price="34" description="8oz 28 Day Matured Fillet Steak with a Triple Cooked Chips Tossed With Parmesan & Truffle Oil, Grilled Portobello Mushroom & Beef Tomato, Served with Peppercorn Sauce" />
                  <MenuItem name="Roast Lamb Best Ends" price="26" description="French Trim Lamb Best Ends" />
                  <MenuItem name="Surf & Turf" price="47" description="Tiger Prawns with 8oz 28 Day Matured Fillet Steak, Grilled Portobello Mushroom & Beef Tomato" />
                  <MenuItem name="Chicken Supreme" price="22" description="French Trim Skin On Chicken Breast with Wingette" />
                  <MenuItem name="Herb Crumb Cod" price="18" description="Served with a Champagne-Saffron Butter, Sauté Potatoes and Asparagus" />
                  <MenuItem name="Mixed Roast" price="26" description="A slice of Beef, a French trimmed Lamb Best End & ½ Chicken Supreme" />
                  <MenuItem name="Salmon En Croute" price="20" description="Served with Dauphinois Potatoes, Buttered Leeks & a Sauvignon Blanc Cream Sauce" />
                  <MenuItem name="Scarlett's Foraged Vegan Wellington" price="19" description="Mushrooms, Nuts & Greens in a Vegan Pastry" />
                  <MenuItem name="Fresh Lobster" price="54" description="Whole Hot Buttered Lobster with a Garlic & Herb Butter (1 ¼ lb uncooked)" />
                  <MenuItem name="Vegan Mediterranean Vegetable Tart" price="16" description="" />
                  <MenuItem name="Tomahawk" price="72" description="1kg On The Bone Ribeye Steak Perfect for sharing between 2. Served with Roast Potatoes, Carrots, Parsnips, Broccoli, Red Cabbage, Yorkshire Puddings, Gravy & Stuffing" />
                  <MenuItem name="Vegetable Roast (v) & (ve)" price="16" description="Served with Roast Potatoes, Carrot, Parsnip, Broccoli, Yorkshire Pudding, Gravy & Stuffing" />
                </div>
                <p className="text-center text-gray-600 italic mt-8 bg-white/50 py-4 rounded-lg">
                  All Roasts Served with Roast Potatoes, Carrot, Parsnip, Broccoli, Yorkshire Pudding, Gravy & Stuffing
                </p>
              </div>

              {/* Sides */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Sides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
                  <SideItem name="Cauliflower Cheese" price="4" />
                  <SideItem name="Extra Potatoes" price="4" />
                  <SideItem name="Extra Yorkie" price="1.50" />
                  <SideItem name="Extra Stuffing" price="2" />
                  <SideItem name="Sunday Veg" price="4" />
                  <SideItem name="Fries" price="4" />
                  <SideItem name="Garlic Ciabatta Bread" price="5" />
                  <SideItem name="Mac'n'Cheese" price="6" />
                  <SideItem name="Triple Cooked Chips Tossed in Parmesan & Truffle Oil" price="6" />
                </div>
                <p className="text-center text-gray-600 italic mt-6 text-sm">
                  Please Note All Menus are Subject to Change
                </p>
              </div>
            </div>
          )}

          {/* Lunch Menu */}
          {activeMenu === 'lunch' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Lunch Menu</h2>
                <p className="text-gray-600 italic">Please make your server aware of any allergens prior to ordering</p>
              </div>

              {/* Starters */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Starters</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Bread & Olives" price="6" description="Focaccia bread, Mixed Olives, Green Olive Tapenade, Infused Whipped Butter" />
                  <MenuItem name="Scallops" price="14" description="Served with a Pea Purree, Mixed Peppers" />
                  <MenuItem name="Prawn Star Martini" price="11" description="King Prawns in a Home-Made Marie-Rose Sauce With Lettuce, Paprika Cracker & Lemon" />
                  <MenuItem name="Pork Trio" price="9" description="Pan Fried Pork Loin, with Crispy Bacon & Black Pudding, Apple Sauce, Sage, Lemon and Garlic" />
                  <MenuItem name="Soup of The Day" price="7" description="Served with ½ a Cheese Toastie" />
                  <MenuItem name="Vegan Mushroom & Black Truffle Arachini" price="12" description="Served with Pomodoro & Balsamic Glaze" />
                  <MenuItem name="Fennel, Pesto & Mozzarella Arancini" price="11" description="With Balsamic Pomodoro & a Garlic Pesto Dressing" />
                  <MenuItem name="Goats Cheese Salad (V)" price="9" description="Served on a Pan-Fried Portobello Mushroom, Mixed Leaf, Walnuts and Balsamic dressing" />
                  <MenuItem name="Tiger Prawns" price="14" description="Headless & Butterflied, cooked in a Garlic-Citrus Butter, With Ciabatta slices" />
                  <MenuItem name="Sauté Garlic Chestnut Mushroom Salad (Ve)" price="9" description="Chestnut Mushrooms, Pan Fried with a Vegan Garlic & Citrus Butter Served with Sliced Ciabatta & Baby Leaf Salad" />
                </div>
              </div>

              {/* Mains */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Mains</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Vegan Mediterranean Vegetable Tart" price="16" description="Served with Potato Salad and Tenderstem Broccoli" />
                  <MenuItem name="King Prawn & Chorizo Tagliatelle" price="18" description="Creamy Garlic, Parsley & Chilli Sauce, Spinach & Cherry Tomato's" note="Swap Prawns For Chicken Or Tenderstem for (V)" />
                  <MenuItem name="Vegan Nut & Mushroom Wellington" price="20" description="Served With Garlic & Herb mash, Tenderstem Broccoli & Vegetable gravy" />
                  <MenuItem name="Herb Crumb Cod" price="18" description="Cod Fillet with a Herb & Bread-Crumb Crust, Served with Sauté Potatoes, Spinach, Asparagus & Champagne & Saffron Butter" />
                  <MenuItem name="Full Monty Burger" price="16" description="Beef, Chicken or Thai Infused Vegan Patty, Mature Cheddar, Streaky Bacon, House Sauce, Lettuce & Red Onion, Tomato, Gherkin & a Onion Ring with Chips." />
                  <MenuItem name="Fresh Lobster" price="54" description="Whole Hot Buttered Lobster with a Garlic & Herb Butter (1 ¼ lb uncooked)" />
                  <MenuItem name="Fillet Steak" price="34" description="8oz 28 Day Matured Fillet with A Mini Steak & Ale Pie, Grilled Portobello Mushroom & Tomato, Served with Peppercorn Sauce" />
                  <MenuItem name="Turkey & Gammon Pie" price="16" description="Served with Garlic Mash, Tenderstem Broccoli & Red wine sauce" />
                  <MenuItem name="Surf & Turf" price="47" description="King Prawns with 8oz 28 Day Matured Fillet Steak, Grilled Portobello Mushroom & Beef Tomato" />
                  <MenuItem name="Chicken Milanese" price="17" description="Served With Spaghetti Arrabbiata" />
                  <MenuItem name="Salmon En Croute" price="20" description="Served with Dauphinois Potatoes, Buttered Leeks & a Sauvignon Blanc Cream Sauce" />
                  <MenuItem name="Lamb Trio" price="27" description="French, Trim Lamb Best End, Lamb Braise & a Mini Shepherds Pie, Served with Tenderstem Broccoli & Red Wine Jus" />
                  <MenuItem name="Free Range, Skin-On, Chicken Supreme" price="19" description="Served with a Sauvignon Blanc & Mushroom Sauce, Sauté Potatoes, Courgette & Asparagus" />
                </div>
              </div>

              {/* Open Sandwiches */}
              <div className="bg-white/50 p-8 rounded-lg">
                <h3 className="text-2xl text-[#2d4a4a] mb-4 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Open Sandwiches</h3>
                <p className="text-center text-gray-600 mb-6 text-sm">Available Wednesday - Saturday 12pm - 4pm</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <MenuItem name="Prawn Marie Rose" price="10" description="A slice of sourdough, & Lettuce" />
                  <MenuItem name="The Open Club" price="13" description="A slice of sourdough, Lettuce Tomato, Egg, Chicken, Bacon Served with a Paprika Mayonnaise" />
                  <MenuItem name="Salt Beef Ciabatta" price="12" description="Salt Beef, Gerkin & English Mustard" />
                </div>
              </div>

              {/* Sides */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Sides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                  <SideItem name="Broccoli, Asparagus, Courgette" price="6" />
                  <SideItem name="Sweet Potato Chips" price="4" />
                  <SideItem name="Petit Pois" price="2.5" />
                  <SideItem name="Triple Cooked Chips in Truffle Oil, Parmesan & Parsley" price="6" />
                  <SideItem name="Garlic & Parsley Mashed Potato" price="4" />
                  <SideItem name="Sautee Potatoes" price="6" />
                  <SideItem name="Chips" price="4" />
                  <SideItem name="Dauphinoise Potatoes" price="5" />
                  <SideItem name="Mac n Cheese" price="6" />
                  <SideItem name="Mac n Cheese Bites" price="6" />
                </div>
              </div>
            </div>
          )}

          {/* Burger Menu */}
          {activeMenu === 'burgers' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>The Gourmet Burger Co Menu</h2>
                <p className="text-gray-600">Our Famous Home-Made Burgers</p>
              </div>

              {/* Beef Burgers */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Our Famous Home-Made Beef Burgers</h3>
                <div className="space-y-4">
                  <MenuItem name="Beef Burger" price="9.99" description="Served with House Sauce, Lettuce & Red Onion in a Brioche Bun" />
                  <MenuItem name="Cheeseburger" price="10.99" description="Served with Melting Mature Cheddar, House Sauce, Lettuce & Red Onion in a Brioche Bun" />
                  <MenuItem name="Bacon Burger" price="11.50" description="Served with Smoked, Streaky Bacon, House Sauce, Lettuce & Red Onion in a Brioche Bun" />
                  <MenuItem name="Bacon Cheeseburger" price="11.99" description="Served with Melting Mature Cheddar, Smoked, Streaky Bacon, House Sauce, Lettuce & Red Onion in a Brioche Bun" />
                  <MenuItem name="Beef Full Monty" price="15.99" description="Served with Melting Mature Cheddar, Smoked, Streaky Bacon, House Sauce, Lettuce & Red Onion, Beef Tomato, Gherkin & a Onion Ring in a Brioche Bun" />
                  <MenuItem name="The Spicy One" price="11.99" description="Served with Mexican Cheese & Chilli Relish, Lettuce & Red Onion in a Brioche Bun" />
                </div>
              </div>

              {/* Chicken Burgers */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Seasoned Chicken Breast Burgers</h3>
                <div className="space-y-4">
                  <MenuItem name="Chicken Burger" price="10.99" description="Served with House Sauce, Lettuce, Tomato & Red Onion in a Brioche Bun" />
                  <MenuItem name="Chicken, Cheese & Bacon Burger" price="11.99" description="Served with Melting Mature Cheddar, Smoked, Streaky Bacon, House Sauce, Lettuce & Red Onion in a Brioche Bun" />
                  <MenuItem name="Southern Fried Chicken Burger" price="10.99" description="Southern Breaded Chicken Breast, Mature Cheddar Cheese, Battered Onion Ring with Mayo, BBQ Glaze, Lettuce, Tomato in a Brioche Bun" />
                  <MenuItem name="Kickin Chicken" price="11.99" description="Served with Mexican Cheese, Lettuce, Red Onion, Jalapenos & Chilli Relish in a Brioche Bun" />
                  <MenuItem name="The Avo Burger" price="11.99" description="Served with House Sauce, Spinach Salad, Avocado & Grilled Bacon in a Brioche Bun" />
                </div>
              </div>

              {/* Vegetarian Burgers */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Vegetarian Burgers</h3>
                <div className="space-y-4">
                  <MenuItem name="The Bangkok Badboy" price="10.99" description="Thai-Infused Vegetable Pate With Spinach Salad, Avocado, Tomato, Red Onion Served in a Brioche Bun" />
                  <MenuItem name="Halloumi Burger" price="10.99" description="Sliced and Grilled Halloumi, Served with Spinach Salad, Avocado, Tomato, Red Onion and Sweet Chilli Sauce in a Brioche Bun" />
                </div>
              </div>

              {/* Sides */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Sides</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <SideItem name="Chips" price="4" />
                  <SideItem name="Onion Rings" price="5" />
                  <SideItem name="Chicken Nuggets" price="5.99" />
                  <SideItem name="Sweet Potato Fries" price="4.50" />
                  <SideItem name="Triple Cooked Chips with Parmesan and Truffle Oil" price="4.95" />
                </div>
              </div>
            </div>
          )}

          {/* Children's Menu */}
          {activeMenu === 'children' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Children's Menu</h2>
                <p className="text-gray-600 italic">Please make your waitress aware of any allergies before ordering</p>
              </div>

              {/* Starters */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Starters</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Garlic Bread Ciabatta" price="3.5" description="Add Cheese for 1" />
                  <MenuItem name="Soup of the Day" price="4" />
                  <MenuItem name="Fennel, Pesto & Mozzarella Arancini" price="7" description="With Balsamic Pomodoro & a Garlic Pesto Dressing" />
                </div>
              </div>

              {/* Mains */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Mains</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <MenuItem name="Roast Chicken Supreme" price="12.95" description="Served with Carrot, Parsnip, Broccoli, Yorkshire Pudding & Gravy" />
                  <MenuItem name="Roast Beef" price="12.95" description="Served with Carrot, Parsnip, Broccoli, Yorkshire Pudding & Gravy" />
                  <MenuItem name="Mediterranean Vegetable Tart (v) & (ve)" price="12.95" description="½ Med Veg Tart, Served with Carrot, Parsnip, Broccoli, Yorkshire Pudding & Gravy" />
                  <MenuItem name="Chicken Nuggets & Chips" price="12.95" description="Served with Peas" />
                  <MenuItem name="Fish Fingers & Chips" price="12.95" description="Served with Peas" />
                </div>
              </div>

              {/* Desserts */}
              <div>
                <h3 className="text-3xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>Desserts</h3>
                <div className="max-w-md mx-auto">
                  <MenuItem name="2 Scoops of Vanilla Ice Cream" price="3" description="Served with Chocolate or Strawberry Sauce" />
                </div>
              </div>
            </div>
          )}

          {/* Book A Table CTA */}
          <div className="text-center mt-16 pt-12 border-t border-gray-300">
            <p className="text-gray-600 mb-6">Ready to experience our delicious food?</p>
            <a
              href="https://www.sevenrooms.com/reservations/themerryfiddlers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium rounded-lg"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Book A Table
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="teal-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <img src="/logo.png" alt="The Merry Fiddlers" className="h-16 w-auto mb-4" />
              <p className="text-white/70 text-sm">Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.</p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                <Clock className="w-5 h-5 text-[#c9a55c]" />
                Opening Hours
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex justify-between"><span>Monday - Tuesday</span><span className="text-red-400">Closed</span></li>
                <li className="flex justify-between"><span>Wednesday - Saturday</span><span className="text-white">12:00 - 00:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="text-white">12:00 - 20:00</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Contact Us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-white/70">
                  <Phone className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="tel:+441992572142" className="hover:text-white">+44 1992 572142</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <Mail className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="mailto:info@themerryfiddlers.co.uk" className="hover:text-white">info@themerryfiddlers.co.uk</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">{item.name}</a>
                    ) : (
                      <Link href={item.href} className="text-white/70 hover:text-white">{item.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} The Merry Fiddlers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function MenuItem({ name, price, description, note }: { name: string; price: string; description?: string; note?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>{name}</h4>
        {price && <span className="text-[#c9a55c] font-bold text-lg">£{price}</span>}
      </div>
      {description && <p className="text-gray-600 text-sm leading-relaxed">{description}</p>}
      {note && <p className="text-[#c9a55c] text-sm italic mt-2">{note}</p>}
    </div>
  );
}

function SideItem({ name, price }: { name: string; price: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[#2d4a4a] font-medium text-sm mb-1">{name}</p>
      <p className="text-[#c9a55c] font-bold">£{price}</p>
    </div>
  );
}
