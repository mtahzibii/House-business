import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Contact() {
  // Initializing
  const [message, setMessage] = useState("");
  const [landlord, setLandLord] = useState(null);
  const searchParams = useSearchParams();

  const params = useParams();

  // load landlord user data (Async/Await request)
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);

      // Check if the data exists and set it to landlord
      if (docSnap.exists()) {
        console.log("exist");
        setLandLord(docSnap.data());
      } else {
        toast.error("Could not get lanlord data");
      }
    };

    // Call async function
    getLandlord();
  }, [params.landlordId]);

  // On change on textarea
  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandLord'>
            <p className='landLordName'>Contact {landlord?.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message'>Message</label>
              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
