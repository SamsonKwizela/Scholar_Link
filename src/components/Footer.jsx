import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

import { ActionIcon, Anchor, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import classes from "./Footer.module.css";

const links = [
  { link: "/contact", label: "Contact" },
  { link: "/about", label: "About" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Store" },
  { link: "#", label: "Careers" },
];

export function FooterCentered() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      component={Link}
      to={link.link}
      lh={1}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        
        {/* LOGO */}
        <Text fw={700} size="lg">
          ScholarLink
        </Text>

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size={18} />
          </ActionIcon>

          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube size={18} />
          </ActionIcon>

          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram size={18} />
          </ActionIcon>
        </Group>

      </div>
    </div>
  );
}