<?php

/**
 * Get RSS feed as html
 * Adapted from https://www.systutorials.com/a-php-function-for-fetching-rss-feed-and-outputing-feed-items-as-html/
 *
 * @param string    $feed_url
 * @param int       $max_item_cnt    Max number of feed items to be displayed
 * @param bool      $show_description
 * @param int       $max_words       Max number of words (not real words, HTML words)
 *                                   If <= 0: no limitation, if > 0 display at most $max_words words
 * @param string    $return_type
 * @param int       $cache_timeout
 * @param string    $cache_prefix
 *
 * @return array|string
 */
function get_rss_feed_as_html(
    string $feed_url,
    int    $max_item_cnt = 10,
    bool   $show_description = true,
    int    $max_words = 0,
    string $return_type = 'array',
    int    $cache_timeout = 7200,
    string $cache_prefix = "/cache/rss2html-"
) {
    $result = "";
    $slides = [];

    // get feeds and parse items
    $rss        = new DOMDocument();
    $cache_file = $cache_prefix . md5($feed_url);

    if( !is_dir('cache') ) {
        mkdir('cache');
    }

    // load from file or load content
    if( $cache_timeout > 0 &&
        is_file($cache_file) &&
        ( filemtime($cache_file) + $cache_timeout > time() ) ) {
        $rss->load($cache_file);
    }
    else {
        $rss->load($feed_url);
        if( $cache_timeout > 0 ) {
            $rss->save(__DIR__ . '/' . $cache_file);
        }
    }
    $feed = array();
    foreach( $rss->getElementsByTagName('entry') as $node ) {
        $item    = array(
            'title'   => $node->getElementsByTagName('title')->item(0)->nodeValue,
            'desc'    => $node->getElementsByTagName('content')->item(0)->nodeValue,
            'link'    => $node->getElementsByTagName('link')->item(0)->getAttribute('href'),
        );
        array_push($feed, $item);
    }
    // real good count
    if( $max_item_cnt > count($feed) ) {
        $max_item_cnt = count($feed);
    }
    $result .= '<ul class="feed-lists">';
    for( $x = 0; $x < $max_item_cnt; $x++ ) {
        $title  = str_replace(' & ', ' &amp; ', $feed[ $x ][ 'title' ]);
        $link   = $feed[ $x ][ 'link' ];
        $result .= '<li class="feed-item">';
        $entry = '<div class="feed-title"><h3><a href="' . $link . '" title="' . $title . '" target="_blank">' . $title . '</a></h3></div>';
        if( $show_description ) {
            $description = $feed[ $x ][ 'desc' ];
            // clean up
            $description = strip_tags(preg_replace('/(<(script|style)\b[^>]*>).*?(<\/\2>)/s', "$1$3", $description), [ '<h3>', '<code>', '<strong>', '<i>', '<em>', '<b>', '<ul>', '<li>', '<a>']);
            // add classes for release type
            foreach( ['breaking', 'changed', 'deprecated', 'feature', 'fixed', 'security', 'announcement', 'issue'] as $type ) {
                $description = str_replace('<h3>' . ucfirst($type) . '</h3>', '<h4 class="release-' . $type . '"></h4>', $description);
            }
            // Transform ul>li into lists
            /** @noinspection RegExpSingleCharAlternation */
            $description = preg_replace("/\r|\n/", "", $description );
            $description = str_replace('<ul>', '', $description);
            $description = str_replace('<li>', '', $description);
            $description = str_replace('</li></ul>', '', $description);
            $description = str_replace('</li>', ', ', $description);

            // whether cut by number of words
            if( $max_words > 0 ) {
                $arr = explode(' ', $description);
                if( $max_words < count($arr) ) {
                    $description = '';
                    $w_cnt       = 0;
                    foreach( $arr as $w ) {
                        $description .= $w . ' ';
                        $w_cnt       = $w_cnt + 1;
                        if( $w_cnt == $max_words ) {
                            break;
                        }
                    }
                    $description .= "...";
                }
            }
            $entry .= '<div class="feed-description">' . $description;
            $entry .= '<div class="read-more-link mt-2"><a href="' . $link . '" title="' . $title . '" target="_blank">Read more</a></div>' . '</div>';
        }
        $slides[] = $entry;
        $result .= $entry;
        $result .= '</li>';
    }
    $result .= '</ul>';
    if($return_type === 'array') {
        return $slides;
    }
    return $result;
}

