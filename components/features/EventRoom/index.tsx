
import s from './.module.scss';
import EventVideos from '@/components/features/EventRoom/ui/VideoCall/EventVideos';


function EventRoom() {

    return (
        <div className={s.VideoCallFeature}>
            <EventVideos />
        </div>
    );
}

export default EventRoom;
