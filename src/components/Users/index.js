import React from 'react';

const Users = (props) => (
    <div>
        <h1>Users</h1>
        {props.users.map(user =>
        <div key={user.id}>{user.name}</div>
        )}
    </div>
)

export default Users;