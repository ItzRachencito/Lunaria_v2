import './Explore.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import DisplayCategory from "../../components/DisplayCategory/DisplayCategory.jsx";
import DisplayItems from "../../components/DisplayItems/DisplayItems.jsx";
import CustomerForm from "../../components/CustomerForm/CustomerForm.jsx";
import CartItems from "../../components/CartItems/CartItems.jsx";
import CartSummary from "../../components/CartSummary/CartSummary.jsx";

const Explore = () => {
    const {categories, auth} = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");

    const isAdmin = auth.role === 'ROLE_ADMIN';
    return (
        <div className="explore-container text-light">
            <div className={isAdmin ? "left-column" : "full-width-column"}>
                <div className="first-row" style={{overflowY: 'auto'}}>
                    <DisplayCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories} />
                </div>
                <hr className="horizontal-line" />
                <div className="second-row" style={{overflowY: 'auto'}}>
                    <DisplayItems selectedCategory={selectedCategory} />
                </div>
            </div>
            {isAdmin && (
                <div className="right-column d-flex flex-column">
                    <div className="customer-form-container" style={{height: '15%'}}>
                        <CustomerForm
                            customerName={customerName}
                            mobileNumber={mobileNumber}
                            setMobileNumber={setMobileNumber}
                            setCustomerName={setCustomerName}
                        />
                    </div>
                    <hr className="my-3 text-light" />
                    <div className="cart-items-container" style={{height: '55%', overflowY: 'auto'}}>
                        <CartItems />
                    </div>
                    <div className="cart-summary-container" style={{height: '30%'}}>
                        <CartSummary
                            customerName={customerName}
                            mobileNumber={mobileNumber}
                            setMobileNumber={setMobileNumber}
                            setCustomerName={setCustomerName}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Explore;