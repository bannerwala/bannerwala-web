import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Screens/Login/Login';
import Dashboard from './Components/Screens/Dashboard/Dashboard';
import UsersList from './Components/Screens/UsersList/UsersList';
import SubscriptionPlans from './Components/Screens/SubscriptionPlans/SubscriptionPlans';
import AddTemplate from './Components/Screens/Dashboard/AddTemplate';
import Categories from './Components/Screens/Categories/Categories';
import AddCategories from './Components/Screens/Categories/AddCategories';
import AddNewPlan from './Components/Screens/SubscriptionPlans/AddNewPlan';
import { ToastContainer } from 'react-toastify';
import AddSubCategories from './Components/Screens/Categories/AddSubCategories';
import SubCategories from './Components/Screens/Categories/SubCategories';
import PrivacyPolicy from './Components/Screens/PrivacyPolicy/PrivacyPolicy';


function App() {
  return (

    <div>
      <Router>
        <ToastContainer />
        <Routes>
          {/* <Route
            path="privacyPolicy"
            element={
              <PublicRoute>
                <PrivacyPolicy
                PrivacyPolicy />
              </PublicRoute>
            }
          /> */}

          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-template" element={<AddTemplate />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/plans" element={<SubscriptionPlans />} />
          {/* <Route path="/add-plan" element={<AddNewPlan />} /> */}
          <Route path="/add-plan/:plan_id?" element={<AddNewPlan />} />
          <Route path="/categories" element={<Categories />} />
          {/* <Route path="/add-category" element={<AddCategories />} /> */}
          <Route path="/add-category/:category_id?" element={<AddCategories />} />

          <Route path="/subcategories" element={<SubCategories />} />
          {/* <Route path="/add-subcategory" element={<AddSubCategories />} /> */}
          <Route path="/add-subcategory" element={<AddSubCategories />} />
          <Route path="/add-subcategory/:subcategory_id?" element={<AddSubCategories />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />




        </Routes>
      </Router>
    </div>
  );
}

export default App;
