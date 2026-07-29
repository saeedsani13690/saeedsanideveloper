import ContactInfo from "@/app/components/contact/ContactInfo"
import ContactForm from "@/app/components/contact/ContactForm"
import FeedbackForm from "@/app/components/contact/FeedbackForm"
import { Container } from "react-bootstrap"
import styles from "./Contact.module.css"

export default function ContactPage(){
    return(
        <>

        <Container className={styles.container}>
            <section>
<ContactInfo/>    
    <ContactForm/>    
    <FeedbackForm/>
            </section>
        </Container>
      
       
        
        
        </>
    )
}