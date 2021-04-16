import './DeleteAccount.scss';

const DeleteAccount = () => {
  return (
    <div className="deleteAccount">
      <div>
        <h3>This will delete your account</h3>
        <p>You’re about to start the process of deleting your account.</p>
        <h3>What else you should know</h3>
        <ul>
          <li>You cannot restore your account.</li>
          <li>
            Your information, e.g., name, grades, exams, etc, will not be
            deleted from the other user's archived subjects.
          </li>
        </ul>
      </div>
      <button className="button">Delete</button>
    </div>
  );
};

export default DeleteAccount;
