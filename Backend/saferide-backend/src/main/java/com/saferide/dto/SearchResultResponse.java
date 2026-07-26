package com.saferide.dto;

public class SearchResultResponse {

    private String type;
    private Long id;
    private String title;
    private String subtitle;

    public SearchResultResponse() {
    }

    public SearchResultResponse(
            String type,
            Long id,
            String title,
            String subtitle
    ) {
        this.type = type;
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
    }

    public String getType() {
        return type;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }
}