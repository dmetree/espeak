import { ExternalLink } from "lucide-react";
import styles from "./OnboardingFooter.module.scss";

export default function OnboardingFooter() {
  return (
    <div className={styles.container}>
      <div className={styles.divider} />
      <div className={styles.content}>
        <div className={styles.socialLinks}>
          <a href="#" className={styles.link}>
            Twitter
            <ExternalLink size={16} />
          </a>
          <a href="#" className={styles.link}>
            Discord
            <ExternalLink size={16} />
          </a>
          <a href="#" className={styles.link}>
            Instagram
            <ExternalLink size={16} />
          </a>
        </div>
        <div className={styles.copyright}>© 2023. All rights reserved.</div>
      </div>
    </div>
  );
}
