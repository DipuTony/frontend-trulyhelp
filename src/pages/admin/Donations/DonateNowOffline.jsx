import React from 'react'
import { useParams } from 'react-router-dom'

const DonateNowOffline = ({ usedFor }) => {
    const { userId } = useParams();
    
    return (
        <div>DonateNowOffline usedFor:{usedFor}
            <p>userID : {userId} </p>
        </div>
    )
}

export default DonateNowOffline