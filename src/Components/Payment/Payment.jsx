import axios from 'axios';
import React, { useContext } from 'react'
import { cartContext } from '../Context/CartContext';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Payment() {

    const nav = useNavigate()


    const { cartId, setCartProducts, setTotalCartPrice, setNumOfCartItems, } = useContext(cartContext)

    async function ConfirmCashPayment() {

        let phone = document.querySelector('#phone').value;
        let city = document.querySelector('#city').value;
        let details = document.querySelector('#details').value;

        const shippingAddress = {
            "shippingAddress": {
                "details": details,
                "phone": phone,
                "city": city
            }
        }

        try {

            const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, shippingAddress, {
                headers: { token: localStorage.getItem('tkn') }
            })

            console.log(data)

            if (data.status === 'success') {
                toast.success('Payment done')

                setCartProducts([]);
                setNumOfCartItems(0);
                setTotalCartPrice(0);

            } else {
                toast.error('payment error')
            }

            nav("/allorders")



        }
        catch (error) {
            console.log('error', error)
        }

    }

    async function ConfirmOnlinePayment() {
        let phone = document.querySelector('#phone').value;
        let city = document.querySelector('#city').value;
        let details = document.querySelector('#details').value;

        const shippingAddress = {
            "shippingAddress": {
                "details": details,
                "phone": phone,
                "city": city
            }
        }

        try {

            const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}`, shippingAddress, {

                headers: { token: localStorage.getItem('tkn') },
                params: { url: 'http://localhost:3000' }
            })

            window.open(data.session.url, "_blank")



        }
        catch (error) {
            console.log('error', error)
        }
    }


    return <section id='payment' className='container'>

        <h2>Payment</h2>

        <form>

            <div className="row">

                <label htmlFor="phone">Phone:</label>
                <input type="text" className='form-control mb-3' id='phone' placeholder='phone ' />

                <label htmlFor="city">City:</label>
                <input type="text" className='form-control mb-3' id='city' placeholder='city' />

                <label htmlFor="details">Details:</label>
                <input type="text" className='form-control mb-5' id='details' placeholder='details' />

                <button onClick={ConfirmCashPayment} type='button' className='btn btn-primary mb-3'>Confirm Cash Payment</button>
                <button onClick={ConfirmOnlinePayment} type='button' className='btn btn-warning mb-5'>Confirm Online Payment</button>

            </div>

        </form>


    </section>
}
