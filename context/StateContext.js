import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;


  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);


    console.log(cartItems);

    
    setTotalQuantities((prevTotalQuantity) => prevTotalQuantity + quantity);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);

    if(checkProductInCart) {
      const newCartItems = cartItems.map((oldCartItem) => {
        return oldCartItem._id === product._id 
        ? {
          ...oldCartItem,
          quantity: oldCartItem.quantity + quantity
          } 
        : oldCartItem 
      })
      setCartItems(newCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([ ...cartItems, { ...product } ]);

    }

    toast.success(`${qty} ${product.name} added to cart.`)
    console.log(cartItems);
  }

  const incQty = () => {
    setQty(prevQty => prevQty + 1);
  }

  const decQty = () => {
    setQty(prevQty => {
      if (prevQty - 1 < 1) return 1; 
      return prevQty - 1;
    });
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice - (foundProduct.quantity * foundProduct.price));
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    // const newCartItems = cartItems.filter((item) => item._id !== id);

    if(value === 'inc') {
      setCartItems((oldCart) => {
        const newCart = oldCart.filter((item) => item._id !== id);
        newCart.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity + 1});
        console.log(foundProduct.quantity);
        return [...newCart]
      })
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);

    } else if(value === 'dec') {
      if(foundProduct.quantity > 1) {
        setCartItems((oldCart) => {
          const newCart = oldCart.filter((item) => item._id !== id);
          newCart.splice(index, 0, { ...foundProduct, quantity: foundProduct.quantity - 1});
          console.log(foundProduct.quantity);
          return [...newCart]
        })
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);

      }
    }
    console.log(foundProduct.quantity);
  }



  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
      }}
    >
      { children }
    </Context.Provider>
  )

}

export const useStateContext = () => useContext(Context);