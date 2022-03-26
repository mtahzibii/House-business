import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
  // Initializing
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);

  // Initialize user
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  // Load data as page loads
  useEffect(() => {
    const fetchUserListings = async () => {
      // set collection target to make query
      const listingsRef = collection(db, "listings");
      // Make query to firestore
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      // Get data from firestore
      const querySnap = await getDocs(q);

      // Initialize listings array
      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          data: doc.data(),
          id: doc.id,
        });
      });

      // Update listings (getting from firestore)
      setListings(listings);
      // Turn off loading
      setLoading(false);
    };

    // Call asyncronous function
    fetchUserListings();
  }, [auth.currentUser.uid]);

  // Extract user data from form data
  const { name, email } = formData;
  const navigate = useNavigate();

  // Logout the user

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  // Change user profile
  const onChange = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Apply user profile changes to Firebase
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in firebase/auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in firebase/firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  // Delelte listing
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      // Set the reference doc that is aimed to be deleted
      const docRef = doc(db, "listings", listingId);
      await deleteDoc(docRef);
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };

  // Edit listing
  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button className='logOut' type='button' onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='personalDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "Done" : "Change"}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              className={!changeDetails ? "profileName" : "profileNameActive"}
              type='text'
              id='name'
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              type='email'
              id='email'
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
