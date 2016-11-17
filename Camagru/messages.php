<?php

    if (isset($_SESSION['info']) == TRUE) {
        ?>
        <div class="success"><?php echo $_SESSION['info'] ?></div>
        <?php
    }
    else if (isset($_SESSION['error']) == TRUE) {
        ?>
        <div class="error"><?php echo $_SESSION['error'] ?></div>
        <?php
    }
    $_SESSION['info'] = NULL;
    $_SESSION['error'] = NULL;

?>