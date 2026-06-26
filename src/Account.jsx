function Account({ user, familyGroupID}) {
    return(
        <div>
            <h2>Your account</h2>
            <p>Email: {user.email}</p>
            <p>Family code: {familyGroupID}</p>
            <p>Share this code with family members so they can join.</p>
        </div>
    )
}

export default Account