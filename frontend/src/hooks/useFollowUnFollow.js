import { useState } from 'react'
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

function useFollowUnFollow(user){
    const currentUser = useRecoilValue(userAtom) // This is the user logged in
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))


    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);

    const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast('Error', 'Please login to follow!')
            return;
        }
        if (updating) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error')
                return;
            }


            if (following) {
                showToast('Success', `${user.name} unfollowed!`, 'success')
                user.followers.pop();
            } else {
                showToast('Success', `${user.name} followed!`, 'success')
                user.followers.push(currentUser?._id)
            }

            setFollowing(!following)



        } catch (error) {
            showToast('Error', error, 'error')
        } finally {
            setUpdating(false)
        }
    }


    return { handleFollowUnfollow, updating, following }
}

export default useFollowUnFollow